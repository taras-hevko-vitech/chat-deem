import React, { useEffect, useRef, useState } from "react";
import "./ChatComponent.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import MessageComponent from "./MessageComponent/MessageComponent";
import ProfileInformation from "../ProfileInformation/ProfileInformation";
import { useLazyQuery, useMutation, useSubscription } from "@apollo/client";
import {
    GET_MESSAGES,
    NEW_MESSAGE_SUBSCRIBE,
    SEND_MESSAGE, USER_TYPING, USER_TYPING_SUBSCRIBE
} from "../../graphql/messsages";
import { useRecoilState } from "recoil";
import { authState, selectedChatId } from "../../state/atoms";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import Typing from "../Typing/Typing";

function ChatComponent() {
    const messagesEndRef = useRef(null);

    const {width} = useWindowDimensions()
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [showUploadMenu, setShowUploadMenu] = useState(false);
    const [userTyping, setUserTyping] = useState(null)

    const [auth] = useRecoilState(authState);
    const [chatId] = useRecoilState(selectedChatId);
    const [getMessagesQuery] = useLazyQuery(GET_MESSAGES);
    const [sendMessageMutation] = useMutation(SEND_MESSAGE);
    const [userTypingMutation] = useMutation(USER_TYPING)

    useSubscription(
        NEW_MESSAGE_SUBSCRIBE,
        { variables: { receiverId: chatId, authId: auth.id },
            onSubscriptionData({subscriptionData: { data}}) {
                setUserTyping(null)
                setChatMessages([...chatMessages, data.newMessage])
            }
        });
    useSubscription(
        USER_TYPING_SUBSCRIBE,
        { variables: { receiverId: auth.id },
            onSubscriptionData({ subscriptionData: { data } }) {
                if (data.userTyping) {
                    setUserTyping(data.userTyping)
                }
            }
        });


    useEffect(() => {
        scrollToBottom();
    }, [chatMessages, userTyping]);

    useEffect(() => {
        const getMessages = async () => {
            const messages = await getMessagesQuery({
                variables: { receiverId: chatId }
            });
            setChatMessages([...messages.data.messageByUser]);
        };
        chatId && getMessages() && setUserTyping(null)
    }, [chatId]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const onSend = async (e) => {
        e.preventDefault();
        if (message.trim().length > 0) {
            await sendMessageMutation({
                variables: {
                    receiverId: chatId,
                    content: message,
                    timestamp: 321341324321431
                }
            });
        }
        setMessage("");
    };

    const handleMessageChange = async (e) => {
        setMessage(e.target.value)
        await userTypingMutation({
            variables: {
                receiverId: chatId
            }
        })
    }

    const isTablet = width < 1100

    return (
        <div className="chat-component">
            {isTablet && <ProfileInformation />}
            <div className="chat-messages">
                {chatMessages.map((mess, i) => (
                    mess &&
                    <MessageComponent
                        key={`${i}+${mess.id}`}
                        isMyMessage={mess.senderId === auth.id}
                        message={mess.content}
                        date={mess.timestamp}
                    />
                ))}
                {userTyping === chatId && <Typing />}
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
                    onChange={handleMessageChange}
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
