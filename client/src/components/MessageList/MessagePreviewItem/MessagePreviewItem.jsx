import React from 'react';
import "./MessagePreviewItem.scss"
import mockIcon from "../../../assets/images/icon-add.png"
import classNames from "classnames";

function MessagePreviewItem({ previewData }) {

    const { username, photoURL, onlineStatus, lastMessageText, lastMessageData } = previewData;

    const statusClassname = classNames({
        "online-status": true,
        "active-status": onlineStatus === "ACTIVE",
        "dont-disturb": onlineStatus === "DONT_DISTURB",
    })

    return (
        <div className="chat-preview">
            <div className="left">
                <img src={photoURL} alt="" className="avatar" />
                <div className={statusClassname} />
            </div>
            <div className="center">
                <div className="username">{username}</div>
                <div className="preview-message">{lastMessageText}</div>
            </div>
            <div className="right">
                <img src={mockIcon} alt="" className="menu-icon"/>
                <div className="message-data">{lastMessageData}</div>
            </div>
        </div>
    );
}

export default MessagePreviewItem;