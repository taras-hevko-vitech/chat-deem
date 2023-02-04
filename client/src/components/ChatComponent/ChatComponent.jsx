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
    SEND_MESSAGE, USER_TYPING, USER_TYPING_SUBSCRIBE,CREATE_NEW_CHAT
} from "../../graphql/messsages";
import { useRecoilState } from "recoil";
import { authState, selectedChatId, selectedUserId } from "../../state/atoms";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import Typing from "../Typing/Typing";
import { useToast } from "../Toast/useToast";
import { TOAST_TYPE } from "../../helper/Constans";

function ChatComponent() {
    const toast = useToast()
    const messagesEndRef = useRef(null);

    const {width} = useWindowDimensions()
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [showUploadMenu, setShowUploadMenu] = useState(false);
    const [userTyping, setUserTyping] = useState(null)

    const [auth] = useRecoilState(authState);
    const [chatId, setChatId] = useRecoilState(selectedChatId);
    const [userId] = useRecoilState(selectedUserId)
    const [getMessagesQuery] = useLazyQuery(GET_MESSAGES);

    const [createChatMutation] = useMutation(CREATE_NEW_CHAT)
    const [sendMessageMutation] = useMutation(SEND_MESSAGE);
    const [userTypingMutation] = useMutation(USER_TYPING)

    useSubscription(
        NEW_MESSAGE_SUBSCRIBE,
        { variables: { chatId: chatId },
            onSubscriptionData({ subscriptionData: { data}}) {
                if (data?.newMessage?.senderId !== auth.id) {
                    // todo CHANGE THIS DEU TO CHAT ROOMS
                    toast.open("You get new message", TOAST_TYPE.success, 3000)
                }
                setUserTyping(null)
                setChatMessages([...chatMessages, data.newMessage])
            }
        });
    useSubscription(
        USER_TYPING_SUBSCRIBE,
        { variables: { chatId: chatId },
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
                variables: { receiverId: userId }
            });
            if (messages.data?.messageByUser.length > 0) {
                setChatMessages([...messages.data.messageByUser]);
                setChatId(messages.data.messageByUser[0].chatId)
            } else {
                setChatMessages([])
            }
        };
        userId && getMessages() && setUserTyping(null)
    }, [userId]);
    console.log("chatId", chatId);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const onSend = async (e) => {
        e.preventDefault();
        if (message.trim().length > 0) {
            await storeMessage()
            setMessage("");
        }
    };
    console.log("userId", userId);
    const storeMessage = async () => {
        if (chatId) {
            await sendMessage()
        } else {
            const response = await createChatMutation({
                variables: {
                    receiverId: userId,
                }
            })
            setChatId(response.data.createNewChat.id)
            await sendMessage(response.data.createNewChat.id)
        }
    }

    const sendMessage = async (chat = chatId) => {
        await sendMessageMutation({
            variables: {
                chatId: chat,
                content: message,
                timestamp: 321341324321431
            }
        });
    }

    const handleMessageChange = async (e) => {
        setMessage(e.target.value)
        if (chatId) {
            await userTypingMutation({
                variables: {
                    chatId: chatId
                }
            })
        }
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
