import React from 'react';

function MessageComponent({ message, }) {
    return (
        <div>
            {message.event === "connection"
                ? <div>Користувач <strong>{message.username}</strong>, зайшов сюди</div>
                : <div><strong>{message.username}</strong>: {message.message}</div>
            }
        </div>
    );
}

export default MessageComponent;