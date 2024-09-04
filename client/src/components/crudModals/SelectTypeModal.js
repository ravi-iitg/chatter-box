import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";
import SearchUsersDrawer from "./SearchUsersDrawer";
import { AddIcon, Search2Icon } from "@chakra-ui/icons";
import GroupChatModal from "./GroupChatModal";

const SelectTypeModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button onClick={onOpen} colorScheme="teal">
        {children}
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w={{ base: "50%", md: "100%" }}>
          <ModalBody display={"flex"} justifyContent="center">
            <SearchUsersDrawer>
              <Search2Icon fontSize="1rem" m={1} />
              <Text display={{ base: "none", md: "flex" }} px={4}>
                New Chat
              </Text>
            </SearchUsersDrawer>
            <GroupChatModal>
              <Text display={{ base: "none", md: "flex" }} px={4}>
                Create New Group
              </Text>
              <AddIcon fontSize="1rem" m={1} />
            </GroupChatModal>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SelectTypeModal;
