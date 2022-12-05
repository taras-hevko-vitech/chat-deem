import React from "react";
import "./MessagePreviewItem.scss";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import {selectedChat} from "../../../state/atoms";

function MessagePreviewItem({ previewData, isMobile }) {
    const navigate = useNavigate();
    const [chat, setChat] = useRecoilState(selectedChat)

    const {
        firstName,
        id = previewData.id,
        lastName,
        photoURL = "https://picsum.photos/seed/picsum/200/300",
        onlineStatus,
        lastMessageText = "It is to early to provide some kind of estimation here. We need user stories.",
        lastMessageData = "12:05pm"
    } = previewData;

    const statusClassname = classNames({
        "online-status": true,
        "active-status": onlineStatus === "ACTIVE",
        "dont-disturb": onlineStatus === "DONT_DISTURB"
    });

    const selectChat = (id) => {
        if (isMobile) {
            navigate("/chat")
        }
        localStorage.setItem("chatID", id)
        setChat(id)
    }

    return (
        <div className="chat-preview" onClick={() => selectChat(id)}>
            <div className="left">
                <img src={photoURL} alt="" className="avatar" />
                <div className={statusClassname} />
            </div>
            <div className="center">
                <div className="username">{`${firstName} ${lastName}`}</div>
                <div className="preview-message">{lastMessageText}</div>
            </div>
            <div className="right">
                <FontAwesomeIcon icon={faEllipsis} />
                <div className="message-data">{lastMessageData}</div>
            </div>
        </div>
    );
}

export default MessagePreviewItem;
