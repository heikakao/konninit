import React from "react";
import {
  IconButton,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Divider,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          d={{ base: "flex" }}
          icon={<HamburgerIcon />}
          bg="none"
          _hover={{ background: "none" }}
          _active={{ background: "none" }}
          size="xl"
          onClick={onOpen}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        {/* {console.log(user)} */}
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            alignItems="center"
            marginTop="40px"
          >
            <Image
              src={user.pic}
              alt={user.name}
              boxSize="120px"
              objectFit="cover"
              borderRadius="full"
            />
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            fontSize="17px"
          >
            <div className="username">{user.name}</div>
            <div className="useremail">{user.email}</div>
          </ModalBody>
          <ModalFooter
            display="flex"
            flexDirection="column"
            gap="12px"
            alignItems="flex-start"
            mb={3}
          >
            <Divider />
            {user.description}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
