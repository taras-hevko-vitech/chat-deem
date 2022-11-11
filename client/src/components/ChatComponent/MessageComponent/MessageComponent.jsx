import React from "react";
import "./MessageComponent.scss";
import classNames from "classnames";

function MessageComponent({ isMy, date, message, type, image }) {
    const messageStyles = classNames({
        "message-content": true,
        "your-message": isMy,
        "not-your-message": !isMy
    });

    return (
        <div className="message-container" style={{ alignItems: isMy ? "flex-end" : "flex-start" }}>
            <div className="message">
                {!isMy && <img src={image} alt="" className="avatar" />}
                <div className={messageStyles}>{message}</div>
                {isMy && <img src={image} alt="" className="avatar" />}
            </div>
            <div className="date">{date}</div>
        </div>
    );
}

export default MessageComponent;
