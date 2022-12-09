import React, { useEffect, useRef, useState } from "react";
import "./ChatComponent.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import MessageComponent from "./MessageComponent/MessageComponent";
import ProfileInformation from "../ProfileInformation/ProfileInformation";
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import { GET_MESSAGES, NEW_MESSAGE_SUBSCRIBE, SEND_MESSAGE } from "../../graphql/messsages";
import { useRecoilState } from "recoil";
import { authState, selectedChatId } from "../../state/atoms";

function ChatComponent({ isTablet, isMobile, isSmallMobile }) {
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [showUploadMenu, setShowUploadMenu] = useState(false);
    const [auth] = useRecoilState(authState);
    const [chatId] = useRecoilState(selectedChatId);

    const [getMessagesQuery] = useLazyQuery(GET_MESSAGES);
    const [sendMessageMutation] = useMutation(SEND_MESSAGE);
    const { data, loading, error } = useSubscription(
        NEW_MESSAGE_SUBSCRIBE,
        { variables: { receiverId: auth.id } });

    const messagesEndRef = useRef(null);
    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    useEffect(() => {
        chatId && getMessages();
    }, [chatId]);

    useEffect(() => {
        if (data && !loading) {
            const { newMessage } = data;
            setChatMessages([...chatMessages, { ...newMessage }]);
        }
    }, [data]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };
    const getMessages = async () => {
        const messages = await getMessagesQuery({
            variables: { receiverId: chatId }
        });
        setChatMessages([...messages.data.messageByUser]);
    };

    const onSend = async (e) => {
        e.preventDefault();
        const response = await sendMessageMutation({
            variables: {
                receiverId: chatId,
                content: message,
                timestamp: 123123
            }
        });
        setMessage("");
        const myMessage = response.data.sendMessage;
        if (myMessage.senderId === auth.id) {
            setChatMessages([...chatMessages, { ...myMessage }]);
        }
    };
    return (
        <div className="chat-component">
            {isTablet && <ProfileInformation isMobile={isMobile} isTablet={isTablet} isSmallMobile={isSmallMobile} />}
            <div className="chat-messages">
                {chatMessages.map((mess, i) => (
                    <MessageComponent
                        key={`${i}+${mess.id}`}
                        isMyMessage={mess.senderId === auth.id}
                        type={mess.type}
                        message={mess.content}
                        date={mess.timestamp}
                    />
                ))}
                <div ref={messagesEndRef} />
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
