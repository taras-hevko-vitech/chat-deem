import React, { useEffect, useState } from "react";
import "./Notification.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faBell, faQuestion } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import { useQuery, useSubscription } from "@apollo/client";
import { GET_UNREAD_MESSAGES, MESSAGE_RECEIVED_SUBSCRIBE } from "../../../graphql/messsages";
import { useRecoilState } from "recoil";
import { authState, selectedChatId, selectedUserId } from "../../../state/atoms";
import { useToast } from "../../Toast/useToast";
import { TOAST_TYPE } from "../../../helper/Constans";

function Notification() {
    const toast = useToast()

    const [chatId, setChatId] = useRecoilState(selectedChatId)
    const [userId, setUserId] = useRecoilState(selectedUserId);
    const [auth] = useRecoilState(authState)
    const [messages, setMessages] = useState([])

    const [openBell, setOpenBell] = useState(false)
    const [isBellAnimated, setBellAnimated] = useState(false)
    const {data} = useQuery(GET_UNREAD_MESSAGES)
    useSubscription(
        MESSAGE_RECEIVED_SUBSCRIBE,
        { variables: { userId: auth.id },
            onSubscriptionData({ subscriptionData: { data}}) {
                const dataMessage = data.messageReceived.message
                const sender = data.messageReceived.user
                if (dataMessage && sender) {
                    toast.open(`You get new message from ${sender.firstName} ${sender.lastName}`, TOAST_TYPE.success, 4000)
                    const isUserAlreadyInList = messages.find(message => message.senderId === dataMessage.senderId)
                    if (isUserAlreadyInList) {
                        const updatedMessageList = messages.map(message => {
                            if (message.senderId === dataMessage.senderId) {
                                message = {
                                    ...message,
                                    content: dataMessage.content,
                                    count: message.count + 1
                                }
                                return message
                            }
                            return message
                        })
                        setMessages(updatedMessageList)
                    } else {
                        setMessages([...messages, {
                            ...dataMessage,
                            ...sender,
                            count: 1
                        }])
                        setBellAnimated(true)
                        removeBellAnimation()
                    }
                }
            }
        });


    useEffect(() => {
        data?.getUnreadMessages && setUnreadMessages()
    }, [data, userId])

    useEffect(() => {
            const count = messages.reduce((total, obj) => {
                return total + obj.count;
            }, 0);
            document.title = `(${count}) Chat Deem`;
            if (count === 0) document.title = `Chat Deem`;
    }, [messages])

    const setUnreadMessages = () => {
        const unreadMessages = data.getUnreadMessages.map(({message, user}) => {
            return {
                ...message,
                ...user,
                count: 1
            }})
        setMessages(unreadMessages)
    }
    const removeBellAnimation = () => {
        setTimeout(() => {
            setBellAnimated(false)
        }, 4000)
    }

    const toggleClickBell = () => {
        setOpenBell(!openBell)
        setBellAnimated(false)
    }

    const selectChat = (id) => {
        setUserId(id);
        setChatId(null)
        const updatedMessages = messages.filter(message => message.chatId === id)
        setMessages([...updatedMessages])
    }

    const bellClassNames = classNames("icon-wrap bell", {
        "bell-active": messages.length > 0,
        "bell-animate": isBellAnimated
    })

    return (
        <div className="notification-list">
            <div className="icon-wrap">
                <FontAwesomeIcon icon={faStar} />
            </div>
            <div className={bellClassNames}  onClick={toggleClickBell}>
                <FontAwesomeIcon icon={faBell}/>
                <ul className="unread-messages">
                {openBell && messages.map((message, i) => (
                    <li key={`${message.id}-${i}`} onClick={() => selectChat(message.senderId)}>
                        <div>
                            <span className="name">{`${message.firstName} ${message.lastName}`}</span>
                            {message.count > 1 && <span>({message.count})</span>}
                            <p className="message">{message.content}</p>
                        </div>
                    </li>
                    )
                )}
                </ul>
            </div>
            <div className="icon-wrap">
                <FontAwesomeIcon icon={faQuestion} />
            </div>
        </div>
    );
}

export default Notification;
