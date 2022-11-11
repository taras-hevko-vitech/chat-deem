import React, { useEffect, useState } from "react";
import AppHeaderComponent from "./components/AppHeaderComponent/AppHeaderComponent";
import Teams from "./components/Teams/Teams";
import MessageList from "./components/MessageList/MessageList";
import ChatComponent from "./components/ChatComponent/ChatComponent";
import ProfileInformation from "./components/ProfileInformation/ProfileInformation";
import AppService from "./service/AppService";
import { Route, Routes } from "react-router";
import SignUpForm from "./components/SignUpForm/SignUpForm";
import Login from "./components/Login/Login";
import AuthRoute from "./components/AuthRoute/AuthRoute";

function Layout({ userSignUp, userAuth, userLogin, auth }) {
    const [windowSize, setWindowSize] = useState(AppService.getWindowSize());

    useEffect(() => {
        function handleWindowResize() {
            setWindowSize(AppService.getWindowSize());
        }

        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    });
    const isSmallMobile = windowSize.innerWidth < 686;
    const isMobile = windowSize.innerWidth < 960;
    const isTablet = windowSize.innerWidth < 1100;

    if (isSmallMobile) {
        return (
            <div className="App">
                <AppHeaderComponent />
                <Routes>
                    <Route path="/" element={<MessageList isMobile={isMobile} isTablet={isTablet} />} />
                    <Route path="/chat" element={<ChatComponent isMobile={isMobile} isTablet={isTablet} isSmallMobile={isSmallMobile} />} />
                    <Route path="*" element={<MessageList isMobile={isMobile} isTablet={isTablet} />} />
                    <Route path="/signup" element={<SignUpForm userSignUp={userSignUp} />} />
                    <Route path="/login" element={<Login userLogin={userLogin} />} />
                </Routes>
            </div>
        );
    }
    return (
        <div className="App">
            <Routes>
                <Route path="/signup" element={<AuthRoute guest userAuth={userAuth}>
                    <SignUpForm userSignUp={userSignUp} />
                </AuthRoute>} />
                <Route exact path="/login" element={<AuthRoute guest auth={auth} userAuth={userAuth}>
                    <Login userLogin={userLogin} />
                </AuthRoute>} />
                <Route path="*" element={
                    <AuthRoute authenticated userAuth={userAuth}>
                        <AppHeaderComponent />
                        <div className="main">
                            <Teams isMobile={isMobile} isTablet={isTablet} />
                            <MessageList isMobile={isMobile} isTablet={isTablet} />
                            {!isTablet && <ProfileInformation />}
                            <ChatComponent isMobile={isMobile} isTablet={isTablet} isSmallMobile={isSmallMobile} />
                        </div>
                    </AuthRoute>
                } />

            </Routes>
        </div>
    );
}

export default Layout;
