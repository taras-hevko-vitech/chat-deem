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
    SEND_MESSAGE, USER_TYPING, USER_TYPING_SUBSCRIBE, SEND_FIRST_MESSAGE, NEW_CHAT_SUBSCRIBE, UPDATE_MESSAGE_IS_READ
} from "../../graphql/messsages";
import { useRecoilState } from "recoil";
import { authState, selectedChatId, selectedUserId } from "../../state/atoms";
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
    const [chatId, setChatId] = useRecoilState(selectedChatId);
    const [userId] = useRecoilState(selectedUserId)
    const [getMessagesQuery] = useLazyQuery(GET_MESSAGES, {
        fetchPolicy: "no-cache"
    });

    const [sendFirstMessageMutation] = useMutation(SEND_FIRST_MESSAGE)
    const [sendMessageMutation] = useMutation(SEND_MESSAGE);
    const [readMessageMutation] = useMutation(UPDATE_MESSAGE_IS_READ)
    const [userTypingMutation] = useMutation(USER_TYPING)

    useSubscription(
        NEW_MESSAGE_SUBSCRIBE,
        { variables: { chatId: chatId },
            onSubscriptionData({ subscriptionData: { data}}) {
                setUserTyping(null)
                setChatMessages([...chatMessages, data.newMessage])
            }
        });
    useSubscription(
        NEW_CHAT_SUBSCRIBE,
        { variables: { userId },
            onSubscriptionData({ subscriptionData: { data}}) {
                setChatMessages([data.newMessageAndChat])
                setChatId(data.newMessageAndChat.chatId)
                getMessagesByUserId()
            }
        });
    useSubscription(
        USER_TYPING_SUBSCRIBE,
        { variables: { chatId },
            onSubscriptionData({ subscriptionData: { data } }) {
                if (data.userTyping) {
                    setUserTyping(data.userTyping)
                }
            }
        });

    useEffect(() => {
        scrollToBottom();
        chatId && readMessages()
    }, [chatMessages, userTyping]);

    useEffect(() => {
        setChatMessages([])
        userId && getMessagesByUserId() && setUserTyping(null)
    }, [userId]);

    const getMessagesByUserId = async (receiverId = userId) => {
        const messages = await getMessagesQuery({
            variables: { receiverId }
        });
        if (messages.data?.messageByUser.length > 0) {
            setChatMessages([...messages.data.messageByUser]);
            setChatId(messages.data.messageByUser[0].chatId)
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const onSend = async (e) => {
        e.preventDefault();
        if (message.trim().length > 0) {
            chatId ? await sendMessage() : await sendFirstMessage()
            setMessage("");
        }
    };

    const sendMessage = async () => {
        await sendMessageMutation({
            variables: {
                chatId: chatId,
                content: message,
            }
        });
    }
    const sendFirstMessage = async () => {
        await sendFirstMessageMutation({
            variables: {
                content: message,
                receiverId: userId
            }
        })
    }

    const readMessages = async () => {
        await readMessageMutation({
            variables: { chatId }
        })
    }

    const handleMessageChange = async (e) => {
        setMessage(e.target.value)
            chatId && await userTypingMutation({
                variables: { chatId }
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
                {userTyping === userId && <Typing />}
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
