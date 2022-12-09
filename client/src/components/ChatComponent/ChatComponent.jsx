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
    const { data: onData } = useSubscription(
        NEW_MESSAGE_SUBSCRIBE,
        { variables: { receiverId: chatId },
                onSubscriptionData({subscriptionData: { data}}) {
                    if ((data.newMessage.receiverId === chatId && data.newMessage.senderId === auth.id) ||
                        (data.newMessage.receiverId === auth.id && data.newMessage.senderId === chatId)
                    ) {
                        setChatMessages([...chatMessages, data.newMessage])
                    }
                }
        });

    const messagesEndRef = useRef(null);
    useEffect(() => {
        scrollToBottom();
    }, [chatMessages]);

    useEffect(() => {
        const getMessages = async () => {
            const messages = await getMessagesQuery({
                variables: { receiverId: chatId }
            });
            setChatMessages([...messages.data.messageByUser]);
        };
        chatId && getMessages();
    }, [chatId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const onSend = async (e) => {
        e.preventDefault();
        await sendMessageMutation({
            variables: {
                receiverId: chatId,
                content: message,
                timestamp: 321341324321431
            }
        });
        setMessage("");
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
