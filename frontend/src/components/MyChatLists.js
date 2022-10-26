import { AddIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { ChatState } from "../context/ChatProvider";
import ChatLoading from "./ChatLoading";
import { getSender, getSenderPic } from "../config/ChatLogic";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChatLists = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDirection="column"
      alignItems="center"
      p={3}
      my={3}
      mx={2}
      w={{ base: "100%", md: "32%" }}
      borderRadius="lg"
      bg="#2b2d33"
    >
      <Box
        p={3}
        fontSize={{ base: "28px", md: "25px" }}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
      >
        Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "13px", lg: "17px" }}
            rightIcon={<AddIcon />}
            fontWeight="normal"
            color="#111"
            bg="#d67050"
            _hover={{ bg: "#bc5637", color: "#ddd" }}
            _active={{ bg: "#a74d31" }}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        p={3}
        gap={12}
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#d1603d" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                _hover={{ bg: selectedChat === chat ? "#d1603d" : "#d1d1d1" }}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
                display="flex"
                alignItems="center"
                gap={3}
              >
                <Avatar
                  size="md"
                  name={
                    !chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName
                  }
                  src={
                    !chat.isGroupChat
                      ? getSenderPic(loggedUser, chat.users)
                      : chat.groupPic
                  }
                />
                <Box>
                  <Text fontSize="16px">
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name}: </b>
                      {chat.latestMessage.content.length > 35
                        ? chat.latestMessage.content.substring(0, 35) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default MyChatLists;
