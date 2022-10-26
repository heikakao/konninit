import React, { useEffect } from "react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Box } from "@chakra-ui/react";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useHistory } from "react-router-dom";

const Homepage = () => {
  const history = useHistory();
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) {
      history.push("/chats");
    }
  }, [history]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minH="100vh"
    >
      <div className="box">
        <div className="form">
          <div className="form-text-box">
            <div className="form-title">User Authentication</div>
            <Tabs isFitted variant="enclosed" mt="1.6rem">
              <TabList color="#d1603d" borderColor="#d1603d">
                <Tab _selected={{ bg: "#d1603d", color: "black" }}>Login</Tab>
                <Tab _selected={{ bg: "#d1603d", color: "black" }}>Sign Up</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <Login />
                </TabPanel>
                <TabPanel>
                  <Signup />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default Homepage;
