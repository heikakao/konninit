import { Avatar, Box, Text } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../context/ChatProvider";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      w="100%"
      display="flex"
      alignItems="center"
      borderRadius="md"
      bg="#E8E8E8"
      px={3}
      py={2}
      my={1}
      _hover={{ background: "#D1603D", color: "white", transition: "all 0.2s" }}
    >
      <Avatar
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
        mr={3}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email:</b> {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
