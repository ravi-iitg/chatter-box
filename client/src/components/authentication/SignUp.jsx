import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { useNavigate } from "react-router";
import { ChatState } from "../../contexts/ChatProvider";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const SignUp = () => {
  const [authValues, setAuthValues] = useState({
    name: "",
    email: "",
    confirmPassword: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { setUser } = ChatState();
  const navigate = useNavigate();
  const handleChange = (event) => {
    setAuthValues({
      ...authValues,
      [event.target.name]: event.target.value,
    });
  };
  const submitHandler = async () => {
    setLoading(true);
    if (
      !authValues.name ||
      !authValues.email ||
      !authValues.password ||
      !authValues.confirmPassword
    ) {
      toast({
        title: "Please Fill all the Feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
    if (authValues.password !== authValues.confirmPassword) {
      toast({
        title: "Passwords Do Not Match",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/user`,
        {
          name: authValues.name,
          email: authValues.email,
          password: authValues.password,
        },
        config
      );
      toast({
        title: "Registration Successful",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUser(data);
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error Occured!",
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
    <VStack spacing="5px">
      <FormControl isRequired>
        <FormLabel>Name :</FormLabel>
        <Input
          type="text"
          placeholder="Enter Your Name"
          name="name"
          onChange={handleChange}></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Email :</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email"
          name="email"
          onChange={handleChange}></Input>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Password : </FormLabel>
        <InputGroup>
          <Input
            type={showPass ? "input" : "password"}
            placeholder="Create Password"
            name="password"
            onChange={handleChange}></Input>
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowPass(!showPass)}>
              {showPass ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Confirm Password : </FormLabel>
        <InputGroup>
          <Input
            type={showPass ? "input" : "password"}
            placeholder="Confirm Password"
            name="confirmPassword"
            onChange={handleChange}></Input>
          <InputRightElement width="4.5rem">
            <Button
              h="1.75rem"
              size="sm"
              onClick={() => setShowPass(!showPass)}>
              {showPass ? <ViewOffIcon /> : <ViewIcon />}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="teal"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}>
        Sign Up
      </Button>
    </VStack>
  );
};

export default SignUp;
