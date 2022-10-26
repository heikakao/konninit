import React, { useState } from "react";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  FormControl,
  Input,
  FormLabel,
  Button,
  FormErrorMessage,
  Box,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import axios from "axios";

const ProfileChangeModal = ({ user, setUser, children }) => {
  function validateEmail(value) {
    let error;
    if (!value) {
      error = "This field is required";
    }
    return error;
  }

  function validateName(value) {
    let error;
    if (value.length > 13) {
      error = "Name can't be longer than 13 letters";
    } else if (!value) {
      error = "This field is required";
    }
    return error;
  }

  function validateDesc(value) {
    let error;
    if (value.length > 500) {
      error = "Description can't be longer than 500 letters";
    } else if (!value) {
      error = "This field is required";
    }
    return error;
  }

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [pic, setPic] = useState();
  const [description, setDescription] = useState();
  const [loading, setLoading] = useState(false);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const submitHandler = async () => {
    try {
      setLoading(true);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        "/api/user/profilechange",
        {
          userId: user._id,
          name: name,
          email: email,
          pic: pic,
          description: description,
        },
        config
      );

      setLoading(false);
      setUser(data);

      onClose();
    } catch (error) {
      toast({
        title: "Failed to Update Profile",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "dopnvpavv");
      fetch("https://api.cloudinary.com/v1_1/dopnvpavv/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setLoading(false);
        });
    } else {
      toast({
        title: "File should be jpeg or png!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            Edit Profile
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            alignItems="center"
            fontSize="17px"
          >
            <Formik
              initialValues={{
                name: user.name,
                email: user.email,
                description: user.description,
              }}
            >
              {(props) => (
                <Form className="rename-form">
                  <Field name="name" validate={validateName}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.name && form.touched.name}
                        mb="12px"
                      >
                        <FormLabel>Name</FormLabel>
                        <Input
                          {...field}
                          placeholder={user.name}
                          onKeyUp={(e) => {
                            setName(e.target.value);
                          }}
                        />
                        <FormErrorMessage>{form.errors.name}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="email" validate={validateEmail}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.email && form.touched.email}
                        mb="12px"
                      >
                        <FormLabel>New Email</FormLabel>
                        <Input
                          {...field}
                          placeholder={user.email}
                          type="email"
                          onKeyUp={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                        <FormErrorMessage>{form.errors.email}</FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="description" validate={validateDesc}>
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={
                          form.errors.description && form.touched.description
                        }
                        mb="12px"
                      >
                        <FormLabel>New Description</FormLabel>
                        <Textarea
                          {...field}
                          placeholder={user.description}
                          onKeyUp={(e) => {
                            setDescription(e.target.value);
                          }}
                        />
                        <FormErrorMessage>
                          {form.errors.description}
                        </FormErrorMessage>
                      </FormControl>
                    )}
                  </Field>
                  <Field name="pic">
                    {({ field, form }) => (
                      <FormControl
                        isInvalid={form.errors.pic && form.touched.pic}
                        mb="12px"
                      >
                        <FormLabel>New Picture</FormLabel>
                        <Input
                          {...field}
                          type="file"
                          accept="image/*"
                          border="none"
                          onChange={(e) => postDetails(e.target.files[0])}
                        />
                      </FormControl>
                    )}
                  </Field>
                  <Box display="flex" justifyContent="flex-end" mt={3}>
                    <Button
                      onClick={submitHandler}
                      isLoading={loading}
                      bg="#d67050"
                      _hover={{ bg: "#bc5637", color: "#ddd" }}
                      _active={{ bg: "#a74d31" }}
                      mb={3}
                    >
                      Save
                    </Button>
                  </Box>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default ProfileChangeModal;
