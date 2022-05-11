import React from 'react';
import MessageComponent from "./MessageComponent";

function Messages({ messages }) {
    return (
        <div className="messages">
            {messages && messages.map(message => (
                <MessageComponent message={message} key={message.id}/>
            ))}
        </div>
    );
}

export default Messages;