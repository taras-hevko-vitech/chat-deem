import React, { useEffect, useState } from "react";
import AppHeaderComponent from "./components/AppHeaderComponent/AppHeaderComponent";
import Teams from "./components/Teams/Teams";
import MessageList from "./components/MessageList/MessageList";
import ChatComponent from "./components/ChatComponent/ChatComponent";
import ProfileInformation from "./components/ProfileInformation/ProfileInformation";
import AppService from "./AppService";
import { Route, Routes } from "react-router";

function Layout() {
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
                </Routes>
            </div>
        );
    }
    return (
        <div className="App">
            {isTablet ? (
                <>
                    <AppHeaderComponent />
                    <div className="main">
                        <Teams isMobile={isMobile} isTablet={isTablet} />
                        <MessageList isMobile={isMobile} isTablet={isTablet} />
                        <ChatComponent isMobile={isMobile} isTablet={isTablet} isSmallMobile={isSmallMobile} />
                    </div>
                </>
            ) : (
                <>
                    <AppHeaderComponent />
                    <div className="main">
                        <Teams />
                        <MessageList />
                        <ProfileInformation />
                        <ChatComponent />
                    </div>
                </>
            )}
        </div>
    );
}

export default Layout;
