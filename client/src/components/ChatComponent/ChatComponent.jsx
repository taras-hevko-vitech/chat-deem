import React, { useEffect, useState } from "react";
import "./ChatComponent.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import MessageComponent from "./MessageComponent/MessageComponent";
import ProfileInformation from "../ProfileInformation/ProfileInformation";
import { useMutation, useSubscription } from "@apollo/client";
import { NEW_MESSAGE_SUBSCRIBE, SEND_MESSAGE } from "../../graphql/messsages";

function ChatComponent({ isTablet, isMobile, isSmallMobile }) {
    const mockMessages = [
        {
            userId: 1,
            type: "TEXT",
            message: "Maybe you already have additional info?",
            date: "14:00pm",
            image: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"
        },
        {
            userId: 1,
            type: "TEXT",
            message: "It is to early to provide some kind of estimation here. We need user stories.",
            date: "14:00pm",
            image: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"
        },
        {
            userId: 2,
            type: "TEXT",
            message: "We are just writing up the user stories now so will have requirements for you next week. ",
            date: "14:00pm",
            image: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"
        },
        {
            userId: 2,
            type: "TEXT",
            message:
                "Essentially the brief is for you guys to build an iOS and android app. We will do backend and web app. We have a version one mockup of the UI, please see it attached. As mentioned before, we would simply hand you all the assets for the UI and you guys code. If you have any early questions please do send them on to myself. Ill be in touch in coming days when we have requirements prepared. ",
            date: "14:00pm",
            image: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"
        },
        {
            userId: 2,
            type: "FILE",
            message: "123",
            date: "14:00pm",
            image: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"
        },
        {
            userId: 1,
            type: "TEXT",
            message: "123",
            date: "14:00pm",
            image: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"
        }
    ];


    const [sendMessageMutation] = useMutation(SEND_MESSAGE)
    const { data, loading, error } = useSubscription(
        NEW_MESSAGE_SUBSCRIBE,
        { variables: { receiverEmail: "hevko.t@gmail.com" } }
    );

    const [chatMessages, setChatMessages] = useState([])
    const [message, setMessage] = useState("")
    const [showUploadMenu, setShowUploadMenu] = useState(false);


    useEffect(() => {
        console.log(data);
    }, [data, loading])


    const onSend = async (e) => {
        e.preventDefault();
        const response = await sendMessageMutation({
            variables: {
                receiverEmail: "hevko.t@gmail.com",
                content: message,
                timestamp: 123123
            }
        })
        console.log(response);
        setMessage("")
    };

    return (
        <div className="chat-component">
            {isTablet && <ProfileInformation isMobile={isMobile} isTablet={isTablet} isSmallMobile={isSmallMobile} />}
            <div className="chat-messages">
                {chatMessages.map((mess, i) => (
                    <MessageComponent
                        key={i}
                        isMy={1 === mess.userId}
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
