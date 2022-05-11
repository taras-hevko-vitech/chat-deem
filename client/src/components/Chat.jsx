import React from "react";
import Messages from "./Messages";

function Chat({ messages }) {

    return (
        <div className="chat">
            <Messages messages={messages}/>
        </div>
    );
}

export default Chat;