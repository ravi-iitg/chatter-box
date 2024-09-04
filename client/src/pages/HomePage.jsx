import React, { useEffect } from "react";
import {
  Box,
  Container,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import Login from "../components/authentication/Login";
import SignUp from "../components/authentication/SignUp";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  //if session exists direct to ChatPage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));
    if (user) navigate("/chats");
  }, []);

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        flexDir={"column"}
        alignItems="center"
        w="100%"
        m="4rem 0 2rem 0"
        bg="#B4CFB0"
        borderRadius="lg"
        boxShadow="dark-lg">
        <Box
          display="flex"
          justifyContent="center"
          p={3}
          w="80%"
          m="2rem 0 2rem 0"
          borderRadius="lg"
          bg="#EAE7B1"
          boxShadow="dark-lg">
          <Text
            fontSize={{ base: "24px", md: "40px", lg: "56px" }}
            fontWeight="bold"
            style={{ color: "#3C6255" }}>
            chatter-box
          </Text>
          <Text
            fontSize={{ base: "24px", md: "40px", lg: "56px" }}
            fontWeight="bold"
            style={{ color: "#789395" }}>
            .
          </Text>
        </Box>
        <Box
          bg="whiteAlpha.700"
          w="90%"
          p={4}
          m="0 0 2rem 0"
          borderRadius="xl"
          borderWidth="1px"
          boxShadow="2xl">
          <Tabs isFitted variant="soft-rounded" colorScheme="green">
            <TabList mb="1em">
              <Tab>Login</Tab>
              <Tab>Sign Up</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Login />
              </TabPanel>
              <TabPanel>
                <SignUp />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Box>
    </Container>
  );
};

export default HomePage;
