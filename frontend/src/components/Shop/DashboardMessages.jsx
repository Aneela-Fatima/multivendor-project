import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { backend_url, server } from "../../server";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AiOutlineArrowRight, AiOutlineSend } from "react-icons/ai";
import { TfiGallery } from "react-icons/tfi";
import socketIO from "socket.io-client";
import { useState } from "react";
import { format } from "timeago.js";
const ENDPOINT = "socket-server-production-357f.up.railway.app";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });
const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect width='50' height='50' fill='%23dbe2ea'/%3E%3Ccircle cx='25' cy='19' r='9' fill='%236b7280'/%3E%3Cpath d='M9 47c2-10 30-10 32 0' fill='%236b7280'/%3E%3C/svg%3E";

const DashboardMessages = () => {
  const { seller } = useSelector((state) => state.seller);
  const [conversations, setConversations] = useState([]);
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [messages, setMessages] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [activeStatus, setActiveStatus] = useState(false);
  const [images, setImages] = useState();

  useEffect(() => {
    socketId.on("getMessage", (data) => {
      setArrivalMessage({
        sender: data.senderId,
        text: data.text,
        createdAt: Date.now(),
      });
    });
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender) &&
      setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentChat]);

  useEffect(() => {
    if (!seller?._id) return;
    axios
      .get(
        `${server}/conversation/get-all-conversation-seller/${seller?._id}`,
        { withCredentials: true },
      )
      .then((res) => {
        setConversations(res.data.conversations);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [seller]);

  useEffect(() => {
    if (seller) {
      const userId = seller?._id;
      socketId.emit("addUser", userId);
      socketId.on("getUsers", (data) => {
        setOnlineUsers(data);
      });
    }
  }, [seller]);

  const onlineCheck = (chat) => {
    const chatMembers = chat?.members?.find((member) => member !== seller?._id);
    const online = onlineUsers.find((user) => user.userId === chatMembers);
    return online ? true : false;
  };

  // get messages
  useEffect(() => {
    if (!currentChat?._id) return;
    const getMessage = async () => {
      try {
        const response = await axios.get(
          `${server}/message/get-all-messages/${currentChat._id}`,
          { withCredentials: true },
        );
        setMessages(response.data.messages);
      } catch (error) {
        console.log(error);
      }
    };
    getMessage();
  }, [currentChat]);

  // create new message
  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!seller?._id || !currentChat?._id || !newMessage.trim()) return;

    const message = {
      sender: seller._id,
      text: newMessage,
      conversationId: currentChat._id,
    };
    const receiverId = currentChat.members.find(
      (member) => member !== seller._id,
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      text: newMessage,
    });

    try {
      if (newMessage !== "") {
        await axios
          .post(`${server}/message/create-new-message`, message, {
            withCredentials: true,
          })
          .then((res) => {
            setMessages([...messages, res.data.message]);
            updateLastMessage();
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessage = async () => {
    socketId.emit("updateLastMessage", {
      lastMessage: newMessage,
      lastMessageId: seller._id,
    });

    await axios
      .put(`${server}/conversation/update-last-message/${currentChat._id}`, {
        lastMessage: newMessage,
        lastMessageId: seller._id,
      })
      .then((res) => {
        console.log(res.data.conversation);
        setNewMessage("");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    setImages(file);
    imageSendingHandler(file);
  };

  const imageSendingHandler = async (e) => {
    const formData = new FormData();

    formData.append("images", e);
    formData.append("sender", seller._id);
  if (!seller?._id) return null;

    formData.append("text", newMessage);
    formData.append("conversationId", currentChat._id);

    const receiverId = currentChat.members.find(
      (member) => member !== seller._id,
    );

    socketId.emit("sendMessage", {
      senderId: seller._id,
      receiverId,
      images: e,
    });
    try {
      await axios
        .post(`${server}/message/create-new-message`, formData, {
          withCredentials: true,
        })
        .then((res) => {
          setImages();
          setMessages([...messages, res.data.message]);
          updateLastMessageForImage();
        });
    } catch (error) {
      console.log(error);
    }
  };

  const updateLastMessageForImage = async () => {
    await axios.put(
      `${server}/conversation/update-last-message/${currentChat._id}`,
      {
        lastMessage: "Photo",
        lastMessageId: seller._id,
      },
      { withCredentials: true },
    );
  };

  return (
    <div className="w-[90%] bg-white m-5 h-[85vh] overflow-y-scroll rounded-2xl shadow-sm">
      {/* All messages list */}
      {!open && (
        <>
          <h1 className="text-center text-[24px] py-4 font-Poppins font-semibold border-b">
            All Messages
          </h1>
          {conversations &&
            conversations.map((item, index) => (
              <MessageList
                data={item}
                key={item._id || index}
                open={open}
                setOpen={setOpen}
                setCurrentChat={setCurrentChat}
                me={seller._id}
                setUserData={setUserData}
                userData={userData}
                online={onlineCheck(item)}
                setActiveStatus={setActiveStatus}
              />
            ))}
        </>
      )}
      {open && (
        <SellerInbox
          setOpen={setOpen}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessageHandler={sendMessageHandler}
          messages={messages}
          sellerId={seller._id}
          userData={userData}
          activeStatus={activeStatus}
          handleImageUpload={handleImageUpload}
          setImages={setImages}
          images={images}
        />
      )}
    </div>
  );
};

const MessageList = ({
  data,
  setOpen,
  setCurrentChat,
  me,
  setUserData,
  online,
  setActiveStatus,
}) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`?${id}`);
    setOpen(true);
  };

  useEffect(() => {
    setActiveStatus(online);
    const userId = data?.members?.find((member) => member !== me);
    if (!userId) return;

    const getUser = async () => {
      try {
        const res = await axios.get(`${server}/user/user-info/${userId}`);

        setUser(res.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    getUser();
  }, [me, data, online, setActiveStatus]);

  return (
    <div
      className="w-full flex items-center p-3 px-4 gap-3 cursor-pointer transition-colors hover:bg-gray-50"
      onClick={(e) =>
        handleClick(data._id) ||
        setCurrentChat(data) ||
        setUserData(user) ||
        setActiveStatus(online)
      }
    >
      <div className="relative shrink-0">
        <img
          src={
            user?.avatar?.url ||
            (typeof user?.avatar === "string"
              ? user.avatar.startsWith("http")
                ? user.avatar
                : `${backend_url}${user.avatar.replace(/^\//, "")}`
              : DEFAULT_AVATAR)
          }
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
        <h1 className="text-[16px] font-medium truncate">{user?.name}</h1>
        <p className="text-[14px] text-gray-500 truncate">
          {data.lastMessageId !== user?._id
            ? "You: "
            : `${user?.name?.split(" ")[0] || "User"}: `}
          {data?.lastMessage}
        </p>
      </div>
    </div>
  );
};

const SellerInbox = ({
  setOpen,
  newMessage,
  setNewMessage,
  sendMessageHandler,
  messages,
  sellerId,
  userData,
  activeStatus,
  handleImageUpload,
  setImages,
  images,
}) => {
  const customerAvatarSrc = userData?.avatar?.url || DEFAULT_AVATAR;

  return (
    <div className="w-full min-h-full flex flex-col justify-between">
      {/* message header */}
      <div className="w-full flex items-center justify-between p-4 bg-white border-b">
        <div className="flex items-center gap-3">
          <img
            src={customerAvatarSrc}
            alt=""
            className="w-[50px] h-[50px] rounded-full object-cover"
          />
          <div>
            <h1 className="text-[17px] font-semibold leading-tight">{userData?.name}</h1>
            {activeStatus && (
              <span className="text-xs text-green-600">Active now</span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          aria-label="Back to all messages"
        >
          <AiOutlineArrowRight size={18} />
        </button>
      </div>

      {/* messages */}
      <div className="px-4 h-[65vh] py-4 overflow-y-scroll bg-[#f7f8fa] space-y-3">
        {messages &&
          messages.map((item, index) => (
            <div
              key={item._id || index}
              className={`flex items-end gap-2 w-full ${
                item.sender === sellerId ? "justify-end" : "justify-start"
              }`}
            >
              {item.sender !== sellerId && (
                <img
                  src={customerAvatarSrc}
                  className="w-[28px] h-[28px] rounded-full object-cover shrink-0"
                  alt=""
                />
              )}

              <div>
                {item.images && (
                  <img
                    src={`${backend_url}${item.images}`}
                    alt="Message attachment"
                    className="w-[220px] h-[220px] object-cover rounded-[12px] mb-1"
                  />
                )}
                {item.text !== "" && (
                  <div>
                    <div
                      className={`w-max max-w-[320px] break-words px-3 py-2 rounded-2xl ${
                        item.sender === sellerId
                          ? "bg-[#f63b60] text-white rounded-br-sm ml-auto"
                          : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                      }`}
                    >
                      <p>{item.text}</p>
                    </div>
                    <p
                      className={`text-[11px] text-gray-400 pt-1 ${
                        item.sender === sellerId ? "text-right" : "text-left"
                      }`}
                    >
                      {format(item.createdAt)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
      {/* send message input */}
      <form
        className="p-3 relative w-full flex gap-2 justify-between items-center bg-white border-t"
        onSubmit={sendMessageHandler}
      >
        <div className="shrink-0">
          <input
            type="file"
            name=""
            id="image"
            className="hidden"
            onChange={handleImageUpload}
          />
          <label htmlFor="image">
            <TfiGallery className="cursor-pointer text-gray-500 hover:text-[#f63b60] transition-colors" size={20} />
          </label>
        </div>
        <div className="flex-1 relative">
          <input
            type="text"
            required
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Enter your message..."
            className="w-full border rounded-full px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#f63b60]/30"
          />
          <input type="submit" value="Send" className="hidden" id="send" />
          <label htmlFor="send">
            <AiOutlineSend
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-[#f63b60] transition-colors"
            />
          </label>
        </div>
      </form>
    </div>
  );
};

export default DashboardMessages;
