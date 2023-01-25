import React from "react";
import "./App.scss";
import Layout from "./Layout";
import { useRecoilState } from "recoil";
import { authState, selectedChatId } from "./state/atoms";
import { useSubscription } from "@apollo/client";
import { USER_ONLINE_SUBSCRIPTION } from "./graphql/user";

function App() {
    const [auth, setAuth] = useRecoilState(authState)
    const [chatID, setChatID] = useRecoilState(selectedChatId)

    const { data, loading } = useSubscription(USER_ONLINE_SUBSCRIPTION, {
        variables: {
            authUserId: auth?.id,
            userId: chatID ? chatID : null,
        },
        skip: !chatID,
    });
    if (!loading && data && chatID) {
        chatID.isOnline = data.isUserOnline.isOnline;
    }
    return (
        <div className="App">
            <Layout />
        </div>
    );
}

export default App;
