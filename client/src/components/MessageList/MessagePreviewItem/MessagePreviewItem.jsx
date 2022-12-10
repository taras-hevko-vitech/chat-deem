import React from "react";
import "./MessagePreviewItem.scss";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import { selectedChatId } from "../../../state/atoms";
import useWindowDimensions from "../../../hooks/useWindowDimensions";

function MessagePreviewItem({ previewData }) {
    const {width} = useWindowDimensions()
    const navigate = useNavigate();
    const [chatId, setChatId] = useRecoilState(selectedChatId);

    const {
        firstName = "Unknown",
        id,
        lastName = "Unknown",
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
        const isMobile = width < 960;
        if (isMobile) {
            navigate("/chat");
        }
        setChatId(id);
    };

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
