import React from "react";
import AppHeaderComponent from "./components/AppHeaderComponent/AppHeaderComponent";
import Teams from "./components/Teams/Teams";
import MessageList from "./components/MessageList/MessageList";
import ChatComponent from "./components/ChatComponent/ChatComponent";
import ProfileInformation from "./components/ProfileInformation/ProfileInformation";
import { Navigate, Route, Routes } from "react-router";
import AuthRoute from "./components/AuthRoute/AuthRoute";
import useWindowDimensions from "./hooks/useWindowDimensions";
import { useRecoilState } from "recoil";
import { authState, selectedChatId } from "./state/atoms";
import SelectChatBanner from "./components/SelectChatBanner/SelectChatBanner";
import Login from "./components/Login/Login";
import SignUpForm from "./components/SignUpForm/SignUpForm";

function Layout() {
    const [auth] = useRecoilState(authState)
    const [chatID] = useRecoilState(selectedChatId)
    const {width} = useWindowDimensions()

    const isSmallMobile = width < 686;
    const isTablet = width < 1100

    if (isSmallMobile) {
        return (
            <div>
                {auth && <AppHeaderComponent />}
                <Routes>
                    <Route exact path="/login" element={<AuthRoute guest>
                        <Login />
                    </AuthRoute>} />
                    <Route exact path="/sign-up" element={<AuthRoute guest>
                        <SignUpForm />
                    </AuthRoute>} />
                    <Route exact path="/chat-deem" element={<AuthRoute authenticated>
                        <MessageList />
                    </AuthRoute>} />
                    <Route exact path="/chat" element={<AuthRoute authenticated>
                        <ChatComponent />
                    </AuthRoute>} />
                    <Route path="*" element={<Navigate to="/chat-deem" />} />
                </Routes>
            </div>
        );
    }
    return (
            <Routes>
                <Route exact path="/login" element={<AuthRoute guest>
                    <Login />
                </AuthRoute>} />
                <Route exact path="/sign-up" element={<AuthRoute guest>
                    <SignUpForm />
                </AuthRoute>} />
                <Route path="/chat-deem" element={
                    <AuthRoute authenticated>
                        <AppHeaderComponent />
                        <div className="main">
                            <Teams />
                            <MessageList />
                            {chatID ? (
                                <>
                                    {!isTablet && <ProfileInformation />}
                                    <ChatComponent />
                                </>
                            ) : (
                                <SelectChatBanner />
                            )}
                        </div>
                    </AuthRoute>
                } />
                <Route path="*" element={<Navigate to="/chat-deem" />} />
            </Routes>
    );
}

export default Layout;
