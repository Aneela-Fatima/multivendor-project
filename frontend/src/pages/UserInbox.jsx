import React, { useState,useEffect } from 'react'
import axios from "axios"
import Header from '../components/Layout/Header'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import socketIO from "socket.io-client";
import {server,backend_url} from "../server"
const ENDPOINT = "http://localhost:4000/";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });
const DEFAULT_AVATAR =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect width='50' height='50' fill='%23dbe2ea'/%3E%3Ccircle cx='25' cy='19' r='9' fill='%236b7280'/%3E%3Cpath d='M9 47c2-10 30-10 32 0' fill='%236b7280'/%3E%3C/svg%3E";

const UserInbox = () => {
  const { user } = useSelector((state) => state.user);
  const { conversationId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [userData, setUserData] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

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

  const sendMessage = async (event) => {
    event.preventDefault();
    if (!newMessage.trim() || !conversationId || !user?._id) return;

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
      await axios.put(
        `${server}/conversation/update-last-message/${conversationId}`,
        { lastMessage: newMessage.trim(), lastMessageId: user._id },
        { withCredentials: true },
      );
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
    <div className="w-full">
    <Header />
    <h1 className="text-center text-[30px] py-3 font-Poppins">
      All Messages
    </h1>
    <div className="flex gap-4 px-4 pb-4">
      <div className="w-full max-w-md">
        {conversations.map((item, index) => (
          <MessageList
            data={item}
            key={item._id || index}
            index={index}
            me={user?._id}
            setUserData={setUserData}
            userData={userData}
            online={onlineCheck(item)}
          />
        ))}
      </div>
      {selectedConversation && (
        <div className="flex-1 border rounded p-4 min-h-[400px] flex flex-col">
          <h2 className="text-xl font-semibold mb-3">
            {userData?.name || "Conversation"}
          </h2>
          <div className="flex-1 overflow-y-auto space-y-2">
            {messages.map((message) => (
              <div
                key={message._id}
                className={`p-2 rounded w-fit ${
                  message.sender === user?._id
                    ? "ml-auto bg-black text-white"
                    : "bg-gray-200"
                }`}
              >
                {message.text}
              </div>
            ))}
          </div>
          <form onSubmit={sendMessage} className="flex gap-2 mt-3">
            <input
              value={newMessage}
              onChange={(event) => setNewMessage(event.target.value)}
              placeholder="Write a message..."
              className="border rounded p-2 flex-1"
            />
            <button type="submit" className="bg-black text-white rounded px-4">
              Send
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
  me,
  setUserData,
  userData,
  online
}) => {
    const navigate = useNavigate()
    const [active,setActive] = useState(0)
    const [user,setUser] = useState(null)
    useEffect(() => {
  const userId = data.members.find((user) => user !== me);

  const getUser = async () => {
    try {
      const res = await axios.get(`${server}/user/user-info/${userId}`);

      setUser(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };
  getUser();
}, [me, data]);
  return (
    <div
      className={`w-full flex p-3 px-3 ${
        active === index ? "bg-[#00000010]" : "bg-transparent"
      } cursor-pointer`}
      onClick={(e) =>
        setActive(index) || navigate(`/inbox/${data._id}`) || setUserData(user)
      }
    >
    <div className="relative">
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
            className="w-[50px] h-[50px] rounded-full"
          />
          {online ? (
            <div className="w-[12px] h-[12px] bg-green-400 rounded-full absolute top-[2px] right-[2px]" />
          ) : (
            <div className="w-[12px] h-[12px] bg-[#c7b9b9] rounded-full absolute top-[2px] right-[2px]" />
          )}
        </div>
        <div className="pl-3">
          <h1 className="text-[18px]">{user?.name || "User"}</h1>
          <p className="text-[16px] text-[#000c]">
            {data?.lastMessageId !== user?._id
              ? "You:"
              : `${user?.name?.split(" ")[0] || "User"}: `}
            {data?.lastMessage}
          </p>
        </div>
      </div>
    )
  }

export default UserInbox