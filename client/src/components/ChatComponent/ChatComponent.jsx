import React, { useEffect, useState } from "react";
import "./ChatComponent.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import MessageComponent from "./MessageComponent/MessageComponent";
import ProfileInformation from "../ProfileInformation/ProfileInformation";
import { useMutation, useSubscription } from "@apollo/client";
import { NEW_MESSAGE_SUBSCRIBE, SEND_MESSAGE } from "../../graphql/messsages";
import { useRecoilState } from "recoil";
import { authState } from "../../state/atoms";

function ChatComponent({ isTablet, isMobile, isSmallMobile }) {
    const [chatMessages, setChatMessages] = useState([])
    const [message, setMessage] = useState("")
    const [showUploadMenu, setShowUploadMenu] = useState(false);

    const [auth] = useRecoilState(authState)
    const [sendMessageMutation] = useMutation(SEND_MESSAGE)
    const { data, loading, error } = useSubscription(
        NEW_MESSAGE_SUBSCRIBE,
        { variables: { receiverId: localStorage.getItem("chatID") } },
    );
    useEffect(() => {
        if (data && !loading) {
            const {newMessage} = data;
            const chatMessage = {
                isMy: newMessage.senderId === auth.id,
                message: newMessage.content,
                date: newMessage.timestamp,
                image: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"
            }
            setChatMessages([...chatMessages, {...chatMessage}])
        }
    }, [data])

    const onSend = async (e) => {
        e.preventDefault();
        await sendMessageMutation({
            variables: {
                receiverId: localStorage.getItem("chatID"),
                content: message,
                timestamp: 123123
            }
        })
        setMessage("")
    };

    return (
        <div className="chat-component">
            {isTablet && <ProfileInformation isMobile={isMobile} isTablet={isTablet} isSmallMobile={isSmallMobile} />}
            <div className="chat-messages">
                {chatMessages.map((mess, i) => (
                    <MessageComponent
                        key={i}
                        isMy={mess.isMy}
                        type={mess.type}
                        message={mess.message}
                        date={mess.date}
                        image={mess.image}
                    />
                ))}
            </div>
            <form className="chat-footer" onSubmit={onSend}>
                <FontAwesomeIcon
                    icon={faPaperclip}
                    className="upload-clip"
                    onClick={() => setShowUploadMenu(!showUploadMenu)}
                />
                <input
                    type="text"
                    className="typing-area"
                    placeholder="Type your message…"
                    onChange={e => setMessage(e.target.value)}
                    value={message}
                />
                <button type="submit">SEND</button>
                {showUploadMenu && (
                    <div className="upload-menu">
                        <div className="upload-item">Photo</div>
                        <div className="upload-item">Video</div>
                        <div className="upload-item">Files</div>
                    </div>
                )}
            </form>
        </div>
    );
}

export default ChatComponent;
