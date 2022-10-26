import React, { useState } from "react";
import { VStack } from "@chakra-ui/layout";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import {
  FormControl,
  FormLabel,
  Button,
  useToast,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { useHistory } from "react-router-dom";

const Signup = () => {
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [confirmpassword, setConfirmpassword] = useState();
  const [password, setPassword] = useState();
  const [description, setDescription] = useState();
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(false);
  const toast = useToast();
  const history = useHistory();

  const handleClick = () => setShow(!show);
  const handleClick1 = () => setShow1(!show1);

  const handleNext = () => {
    if (!name || !email || !password || !confirmpassword) {
      toast({
        title: "Please Fill All the Fields First",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (password !== confirmpassword) {
      toast({
        title: "Passwords do not match!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    setNext(true);
  };

  const handleBack = () => {
    setNext(false);
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

  const submitHandler = async () => {
    setLoading(true);

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        "api/user",
        {
          name,
          email,
          password,
          pic,
          description,
        },
        config
      );
      toast({
        title: "Registration successful!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));

      setLoading(false);
      history.push("/chats");
      window.location.reload(true);
    } catch (error) {
      toast({
        title: "Error occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="1rem" color="white">
      <div style={{ display: next ? "none" : "block", width: "100%" }}>
        <FormControl id="first-name" isRequired>
          <FormLabel color="#da8064">Name</FormLabel>
          <Input
            placeholder="Enter Your Name"
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel color="#da8064" mt="1rem">
            Email
          </FormLabel>
          <Input
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl id="password" isRequired>
          <FormLabel color="#da8064" mt="1rem">
            Password
          </FormLabel>
          <InputGroup>
            <Input
              type={show ? "text" : "password"}
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
            />

            <InputRightElement width="4.5rem">
              <Button
                backgroundColor="#d1603d"
                color="black"
                h="1.75rem"
                size="sm"
                onClick={handleClick}
              >
                {show ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <FormControl id="confirm-password" isRequired>
          <FormLabel color="#da8064" mt="1rem">
            Confirm Password
          </FormLabel>
          <InputGroup>
            <Input
              type={show1 ? "text" : "password"}
              placeholder="Confirm Your Password"
              onChange={(e) => setConfirmpassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button
                backgroundColor="#d1603d"
                color="black"
                h="1.75rem"
                size="sm"
                onClick={handleClick1}
              >
                {show1 ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button
            onClick={handleNext}
            bg="#d67050"
            _hover={{ bg: "#bc5637", color: "#ddd" }}
            _active={{ bg: "#a74d31" }}
            color="black"
            mt={5}
          >
            Next
          </Button>
        </div>
      </div>
      <div style={{ display: next ? "block" : "none", width: "100%" }}>
        <FormControl id="pic">
          <FormLabel color="#da8064">Upload Your Picture</FormLabel>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            border="none"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </FormControl>

        <FormControl id="description">
          <FormLabel color="#da8064" mt="1rem">
            Description
          </FormLabel>
          <Textarea
            placeholder="Tell us about yourself..."
            onChange={(e) => setDescription(e.target.value)}
          />
        </FormControl>

        <Button
          onClick={handleBack}
          bg="#d67050"
          _hover={{ bg: "#bc5637", color: "#ddd" }}
          _active={{ bg: "#a74d31" }}
          color="black"
          mt={3}
        >
          Back
        </Button>

        <Button
          width="100%"
          mt={5}
          onClick={submitHandler}
          bg="#d67050"
          _hover={{ bg: "#bc5637", color: "#ddd" }}
          _active={{ bg: "#a74d31" }}
          color="black"
          isLoading={loading}
        >
          Sign Up
        </Button>
      </div>
    </VStack>
  );
};

export default Signup;
