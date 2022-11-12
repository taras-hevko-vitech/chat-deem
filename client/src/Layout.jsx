import React, { useEffect, useState } from "react";
import AppHeaderComponent from "./components/AppHeaderComponent/AppHeaderComponent";
import Teams from "./components/Teams/Teams";
import MessageList from "./components/MessageList/MessageList";
import ChatComponent from "./components/ChatComponent/ChatComponent";
import ProfileInformation from "./components/ProfileInformation/ProfileInformation";
import AppService from "./service/AppService";
import { Navigate, Route, Routes } from "react-router";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import AuthPage from "./pages/AuthPage";

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
                    <Route exact path="/login" element={<AuthRoute guest>
                        <AuthPage />
                    </AuthRoute>} />
                    <Route exact path="/chat-deem" element={<AuthRoute authenticated>
                        <MessageList isMobile={isMobile} isTablet={isTablet} />
                    </AuthRoute>} />
                    <Route exact path="/chat" element={<AuthRoute authenticated>
                        <ChatComponent isMobile={isMobile} isTablet={isTablet} isSmallMobile={isSmallMobile} />
                    </AuthRoute>} />
                    <Route path="*" element={<Navigate to="/chat-deem" />}/>
                </Routes>
            </div>
        );
    }
    return (
        <div className="App">
            <Routes>
                <Route exact path="/login" element={<AuthRoute guest>
                    <AuthPage />
                </AuthRoute>} />
                <Route path="/chat-deem" element={
                    <AuthRoute authenticated>
                        <AppHeaderComponent />
                        <div className="main">
                            <Teams isMobile={isMobile} isTablet={isTablet} />
                            <MessageList isMobile={isMobile} isTablet={isTablet} />
                            {!isTablet && <ProfileInformation />}
                            <ChatComponent isMobile={isMobile} isTablet={isTablet} isSmallMobile={isSmallMobile} />
                        </div>
                    </AuthRoute>
                } />
                <Route path="*" element={<Navigate to="/chat-deem" />}/>
            </Routes>
        </div>
    );
}

export default Layout;
