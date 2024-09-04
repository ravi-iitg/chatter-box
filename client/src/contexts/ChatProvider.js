import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [selectedChat, setSelectedChat] = useState();
  const [user, setUser] = useState(undefined);
  const [notification, setNotification] = useState([]);
  const [chats, setChats] = useState(undefined);
  const [onCall, setOnCall] = useState(false);
  const [reciever, setReciever] = useState();
  const [caller, setCaller] = useState();

  const logout = () => {
    setUser();
    setChats();
    setSelectedChat();
    setNotification([]);
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);
    if (!userInfo) {
      navigate("/");
    }
  }, []);

  return (
    <ChatContext.Provider
      value={{
        selectedChat,
        setSelectedChat,
        user,
        setUser,
        notification,
        setNotification,
        chats,
        setChats,
        logout,
        onCall,
        setOnCall,
        setReciever,
        reciever,
        caller,
        setCaller,
      }}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
