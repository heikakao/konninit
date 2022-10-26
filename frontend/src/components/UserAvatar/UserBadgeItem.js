import { CloseIcon } from "@chakra-ui/icons";
import { Avatar, Box, Tooltip } from "@chakra-ui/react";
import React from "react";
import { IonIcon } from "@ionic/react";
import { closeCircle } from "ionicons/icons";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Tooltip label={user.name} hasArrow>
      <Box
        p={2}
        borderRadius="full"
        cursor="pointer"
        onClick={handleFunction}
        position="relative"
      >
        <Avatar src={user.pic} size="md" />
        <Box position="absolute" bottom="0" right="1" color="#D1603D">
          <IonIcon icon={closeCircle} size="small" />
        </Box>
      </Box>
    </Tooltip>
  );
};

export default UserBadgeItem;
