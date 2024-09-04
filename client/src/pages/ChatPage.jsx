import { Box } from "@chakra-ui/layout";
import { useState } from "react";
import Chatbox from "../components/layoutComponents/ChatBox";
import MyChats from "../components/layoutComponents/Chats";
import Navbar from "../components/layoutComponents/Navbar";
import { ChatState } from "../contexts/ChatProvider";
import { Outlet } from "react-router-dom";

const ChatPage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user, onCall } = ChatState();

  return (
    <div style={{ width: "100%" }}>
      {user && <Navbar />}
      {!onCall && (
        <Box
          display="flex"
          justifyContent="space-between"
          w="100%"
          h="91.5vh"
          p="10px">
          {user && <MyChats fetchAgain={fetchAgain} />}
          {user && (
            <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
          )}
        </Box>
      )}
      {user && onCall && <Outlet />}
    </div>
  );
};

export default ChatPage;
