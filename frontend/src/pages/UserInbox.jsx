import React, { useState, useEffect } from 'react'
import axios from "axios"
import Header from '../components/Layout/Header'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import socketIO from "socket.io-client";
import { format } from "timeago.js";
import { AiOutlineSend } from "react-icons/ai";
import { server, backend_url } from "../server"
const ENDPOINT = "socket-server-production-357f.up.railway.app";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });
const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect width='50' height='50' fill='%23dbe2ea'/%3E%3Ccircle cx='25' cy='19' r='9' fill='%236b7280'/%3E%3Cpath d='M9 47c2-10 30-10 32 0' fill='%236b7280'/%3E%3C/svg%3E";

// The other party in a customer's conversation is always the shop
// (conversations are created as members: [userId, sellerId]), so its
// avatar is a Cloudinary object ({ url }) rather than a local upload path.
const shopAvatarSrc = (shop) => shop?.avatar?.url || DEFAULT_AVATAR;

const UserInbox = () => {
  const { user } = useSelector((state) => state.user);
  const { conversationId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [shopData, setShopData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);

  const selectedConversation = conversations.find(
    (conversation) => conversation._id === conversationId,
  );

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    axios
      .get(`${server}/message/get-all-messages/${conversationId}`, {
        withCredentials: true,
      })
      .then((res) => setMessages(res.data.messages || []))
      .catch((error) => console.log(error));
  }, [conversationId]);

  // Live incoming messages pushed from the socket server
  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        images: data.images,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    if (
      arrivalMessage &&
      selectedConversation?.members?.includes(arrivalMessage.sender)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, selectedConversation]);

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!newMessage.trim() || !conversationId || !user?._id) return;

    const receiverId = selectedConversation?.members?.find(
      (member) => member !== user._id,
    );

    try {
      const { data } = await axios.post(
        `${server}/message/create-new-message`,
        {
          sender: user._id,
          text: newMessage.trim(),
          conversationId,
        },
        { withCredentials: true },
      );

      socketId.emit("sendMessage", {
        senderId: user._id,
        receiverId,
        text: newMessage.trim(),
      });

      await axios.put(
        `${server}/conversation/update-last-message/${conversationId}`,
        { lastMessage: newMessage.trim(), lastMessageId: user._id },
        { withCredentials: true },
      );
      socketId.emit("updateLastMessage", {
        lastMessage: newMessage.trim(),
        lastMessageId: user._id,
      });

      setMessages((currentMessages) => [...currentMessages, data.message]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    axios
      .get(
        `${server}/conversation/get-all-conversation-user/${user?._id}`,
        { withCredentials: true },
      )
      .then((res) => {
        setConversations(res.data.conversations);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [user]);


  useEffect(() => {
    if (user) {
      const userId = user?._id;
      socketId.emit("addUser", userId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [user]);

  const onlineCheck = (chat) => {
    const chatMembers = chat.members.find((member) => member !== user?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };



  return (
    <div className="w-full bg-[#f5f7fb] min-h-screen">
      <Header />
      <h1 className="text-center text-[30px] py-3 font-Poppins">
        All Messages
      </h1>
      <div className="flex gap-4 px-4 pb-4 max-w-6xl mx-auto">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-sm overflow-hidden">
          {conversations.map((item, index) => (
            <MessageList
              data={item}
              key={item._id || index}
              index={index}
              active={item._id === conversationId}
              me={user?._id}
              setShopData={setShopData}
              online={onlineCheck(item)}
            />
          ))}
        </div>
        {selectedConversation && (
          <div className="flex-1 bg-white rounded-2xl shadow-sm p-4 min-h-[500px] flex flex-col">
            <div className="flex items-center gap-3 border-b pb-3 mb-3">
              <img
                src={shopAvatarSrc(shopData)}
                alt=""
                className="w-[45px] h-[45px] rounded-full object-cover"
              />
              <div>
                <h2 className="text-lg font-semibold leading-tight">
                  {shopData?.name || "Shop"}
                </h2>
                {onlineCheck(selectedConversation) && (
                  <span className="text-xs text-green-600">Active now</span>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 px-1">
              {messages.map((message, index) => {
                const isMine = message.sender === user?._id;
                return (
                  <div
                    key={message._id || index}
                    className={`flex items-end gap-2 ${
                      isMine ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isMine && (
                      <img
                        src={shopAvatarSrc(shopData)}
                        alt=""
                        className="w-[28px] h-[28px] rounded-full object-cover"
                      />
                    )}
                    <div>
                      {message.images && (
                        <img
                          src={`${backend_url}${message.images}`}
                          alt="attachment"
                          className="w-[220px] h-[220px] object-cover rounded-[12px] mb-1"
                        />
                      )}
                      {message.text && (
                        <div
                          className={`px-3 py-2 rounded-2xl max-w-[320px] break-words ${
                            isMine
                              ? "bg-[#f63b60] text-white rounded-br-sm"
                              : "bg-gray-100 text-gray-800 rounded-bl-sm"
                          }`}
                        >
                          {message.text}
                        </div>
                      )}
                      <p
                        className={`text-[11px] text-gray-400 mt-1 ${
                          isMine ? "text-right" : "text-left"
                        }`}
                      >
                        {message.createdAt ? format(message.createdAt) : ""}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <form onSubmit={sendMessage} className="flex gap-2 mt-3 pt-3 border-t">
              <input
                value={newMessage}
                onChange={(event) => setNewMessage(event.target.value)}
                placeholder="Write a message..."
                className="border rounded-full px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-[#f63b60]/30"
              />
              <button
                type="submit"
                className="bg-[#f63b60] hover:bg-[#e02f52] text-white rounded-full w-10 h-10 flex items-center justify-center shrink-0 transition-colors"
                aria-label="Send"
              >
                <AiOutlineSend size={18} />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}


const MessageList = ({
  data,
  index,
  active,
  me,
  setShopData,
  online,
}) => {
  const navigate = useNavigate()
  const [shop, setShop] = useState(null)
  useEffect(() => {
    const shopId = data.members.find((member) => member !== me);
    if (!shopId) return;

    const getShop = async () => {
      try {
        const res = await axios.get(`${server}/shop/get-shop-info/${shopId}`);
        setShop(res.data.shop);
      } catch (error) {
        console.log(error);
      }
    };
    getShop();
  }, [me, data]);

  return (
    <div
      className={`w-full flex items-center p-3 px-4 gap-3 cursor-pointer transition-colors hover:bg-gray-50 ${
        active ? "bg-[#fdeef1]" : "bg-transparent"
      }`}
      onClick={() => {
        navigate(`/inbox/${data._id}`);
        setShopData(shop);
      }}
    >
      <div className="relative shrink-0">
        <img
          src={shopAvatarSrc(shop)}
          alt=""
          className="w-[50px] h-[50px] rounded-full object-cover"
        />
        {online ? (
          <div className="w-[12px] h-[12px] bg-green-400 border-2 border-white rounded-full absolute bottom-0 right-0" />
        ) : (
          <div className="w-[12px] h-[12px] bg-[#c7b9b9] border-2 border-white rounded-full absolute bottom-0 right-0" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <h1 className="text-[16px] font-medium truncate">{shop?.name || "Shop"}</h1>
        <p className="text-[14px] text-gray-500 truncate">
          {data?.lastMessageId !== shop?._id
            ? "You: "
            : `${shop?.name?.split(" ")[0] || "Shop"}: `}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  )
}

export default UserInbox
