import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalHeader,
  Input,
  useToast,
  Spinner,
  MenuGroup,
  Divider,
  Badge,
} from "@chakra-ui/react";
import { IonIcon } from "@ionic/react";
import { searchOutline } from "ionicons/icons";
import { BellIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import React, { useState } from "react";
import { ChatState } from "../../context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useHistory } from "react-router-dom";
import ChatLoading from "../ChatLoading";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogic";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const {
    user,
    setUser,
    setSelectedChat,
    chats,
    setChats,
    notifications,
    setNotifications,
  } = ChatState();

  const history = useHistory();

  const signoutHandler = () => {
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const toast = useToast();

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter something in searchbox",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }
    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/chat", { userId }, config);

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        boxShadow="xl"
        p="15px 10px"
      >
        <Box></Box>
        <Button
          leftIcon={<IonIcon icon={searchOutline} />}
          justifyContent="left"
          alignItems="center"
          w="50vw"
          size="sm"
          variant="solid"
          fontWeight="normal"
          boxShadow="lg"
          color="#4c4c4c"
          bg="#ccc"
          _hover={{ bg: "#e6e6e6" }}
          _active={{ bg: "#fff" }}
          onClick={onOpen}
        >
          Search users
        </Button>
        <div className="side-menu">
          <Menu>
            <MenuButton color="white" position="relative">
              <BellIcon fontSize="2xl" />
              <Badge
                colorScheme="orange"
                position="absolute"
                top={0}
                right={-1}
                display={notifications.length > 0 ? "block" : "none"}
              >
                {notifications.length}
              </Badge>
            </MenuButton>
            <MenuList pl={2} fontSize="15px">
              {!notifications.length && "There is no notification"}
              {notifications.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotifications(notifications.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton mr={3}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList fontSize="14px">
              <MenuGroup title="Profile">
                <ProfileModal user={user}>
                  <MenuItem>My Profile</MenuItem>
                </ProfileModal>
              </MenuGroup>
              <Divider />
              <MenuGroup title="Account">
                <MenuItem onClick={signoutHandler}>Sign Out</MenuItem>
              </MenuGroup>
            </MenuList>
          </Menu>
        </div>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Search users</ModalHeader>
          <ModalBody>
            <Box display="flex" pb={2} gap="16px">
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button
                onClick={handleSearch}
                bg="#e8e8e8"
                _hover={{ background: "#D1603D", color: "white" }}
              >
                Go
              </Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
              ))
            )}
            {loadingChat && (
              <Spinner
                ml="auto"
                display="flex"
                thickness="3px"
                color="#d1603d"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SideDrawer;
