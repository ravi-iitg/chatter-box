import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { ChatState } from "../../contexts/ChatProvider";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

const Login = () => {
  const [authValues, setAuthValues] = useState({
    email: "",
    password: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = ChatState();
  const toast = useToast();
  const navigate = useNavigate();
  const handleChange = (event) => {
    setAuthValues({
      ...authValues,
      [event.target.name]: event.target.value,
    });
  };
  const submitHandler = async () => {
    setLoading(true);
    if (!authValues.email || !authValues.password) {
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

    //console.log(email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post(
        `http://localhost:5000/api/user/login`,
        { email: authValues.email, password: authValues.password },
        config
      );

      // console.log(JSON.stringify(data));
      toast({
        title: "Login Successful",
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
            placeholder="Password"
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
      <Button
        colorScheme="teal"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}>
        Login
      </Button>
    </VStack>
  );
};

export default Login;
