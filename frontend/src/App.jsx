import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./screens/Home";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import Profile from "./screens/Profile";
import CreatePost from "./screens/CreatePost";
import UserProfile from "./screens/UserProfile";
import FollowingPage from "./screens/FollowingPage";
import { LoginContext } from "./context/LoginContext";
import Modal from "./screens/Modal";
import { GoogleOAuthProvider } from '@react-oauth/google';


const App = () => {
  const [userLogin, setUserLogin] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="App">
      <GoogleOAuthProvider clientId="914751995071-333ch7m1495282l7ne9p2hbjgdk7ia4j.apps.googleusercontent.com">;
        <LoginContext.Provider value={{ setUserLogin, setModalOpen, userLogin }}>
          <BrowserRouter>
            <Navbar login={userLogin} />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route exact path="/profile" element={<Profile />} />
              <Route path="/createpost" element={<CreatePost />} />
              <Route path="/profile/:id" element={<UserProfile />} />
              <Route path="/myfollowing" element={<FollowingPage />} />
            </Routes>
          </BrowserRouter>
          {modalOpen ? <Modal /> : ""}
        </LoginContext.Provider>
      </GoogleOAuthProvider>
    </div>
  );
};

export default App;
