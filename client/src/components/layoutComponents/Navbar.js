import { Button } from "@chakra-ui/button";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import ProfileModal from "../crudModals/ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../logicFunctions/ChatLogics";
import { ChatState } from "../../contexts/ChatProvider";
import { SocketState } from "../../contexts/SocketProvider";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function NavBar() {
  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    logout,
    onCall,
    setOnCall,
    caller,
    setCaller,
  } = ChatState();
  const [incomingCall, setIncomingCall] = useState(false);

  const [roomId, setRoomId] = useState();
  const socket = SocketState();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("incoming call", (caller, roomId) => {
      setIncomingCall(true);
      setRoomId(roomId);
      setCaller(caller);
    });
  });

  const answerCall = (roomId) => {
    setOnCall(true);
    navigate(`/chats/video-call/${roomId}`);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px">
        <Text
          fontSize={{ base: "1.2rem", md: "2rem" }}
          fontWeight="bold"
          paddingLeft="5"
          style={{ display: "flex", color: "#3C6255" }}>
          chatter-box
          <span
            style={{ color: "#789395", fontSize: "4xl", fontWeight: "bold" }}>
            .
          </span>
        </Text>
        {incomingCall && !onCall && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <h1>{caller.name} is calling:</h1>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                answerCall(roomId);
              }}>
              Answer
            </Button>
          </div>
        )}
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}>
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar size="sm" cursor="pointer" name={user.name} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>
    </>
  );
}

export default NavBar;
