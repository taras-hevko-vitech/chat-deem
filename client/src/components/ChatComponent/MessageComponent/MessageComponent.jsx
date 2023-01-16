import React from "react";
import "./MessageComponent.scss";
import classNames from "classnames";

function MessageComponent({
      isMyMessage,
      date,
      message,
      image = "https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"
  }) {
    const messageStyles = classNames({
        "message-content": true,
        "your-message": isMyMessage,
        "not-your-message": !isMyMessage
    });

    return (
        <div className="message-container" style={{ alignItems: isMyMessage ? "flex-end" : "flex-start" }}>
            <div className="message">
                {!isMyMessage && <img src="https://picsum.photos/seed/picsum/200/300" alt="" className="avatar" />}
                <div className={messageStyles}>{message}</div>
                {isMyMessage && <img src={image} alt="" className="avatar" />}
            </div>
            <div className="date">{date}</div>
        </div>
    );
}

export default MessageComponent;
