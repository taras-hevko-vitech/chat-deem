import React, { useState } from "react";
import "./MessageList.scss";
import MessagePreviewItem from "./MessagePreviewItem/MessagePreviewItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import Teams from "../Teams/Teams";
import classNames from "classnames";

function MessageList({ isMobile }) {
    const chatsData = [
        {
            username: "Matt Thompson",
            photoURL: "https://picsum.photos/seed/picsum/200/300",
            onlineStatus: "ACTIVE",
            lastMessageText: "We are just writing up the user stories now so will have requirements for you next week. ",
            lastMessageData: "18:00pm"
        },
        {
            username: "Aaron Walker",
            photoURL: "https://picsum.photos/seed/picsum/200/300",
            onlineStatus: null,
            lastMessageText: "It is to early to provide some kind of estimation here. We need user stories.",
            lastMessageData: "12:05pm"
        },
        {
            username: "Rachel Curtis",
            photoURL: "https://picsum.photos/seed/picsum/200/300",
            onlineStatus: "DONT_DISTURB",
            lastMessageText: "Maybe you already have additional info?",
            lastMessageData: "17:21pm"
        },
        {
            username: "Stephanie Bailey",
            photoURL: "https://picsum.photos/seed/picsum/200/300",
            onlineStatus: "ACTIVE",
            lastMessageText: "We are just writing up the user stories now so will have requirements for you next week. ",
            lastMessageData: "14:05pm"
        },
        {
            username: "Amy Matthews",
            photoURL: "https://picsum.photos/seed/picsum/200/300",
            onlineStatus: "DONT_DISTURB",
            lastMessageText: "We are just writing up the user stories now so will have requirements for you next week. ",
            lastMessageData: "18:00pm"
        },
        {
            username: "Helen Newman",
            photoURL: "https://picsum.photos/seed/picsum/200/300",
            onlineStatus: "DONT_DISTURB",
            lastMessageText:
                "Essentially the brief is for you guys to build an iOS and android app. We will do backend and web app. We have a version one mockup of the UI, please see it attached. As mentioned before, we would simply hand you all the assets for the UI and you guys code. If you have any early questions please do send them on to myself. Ill be in touch in coming days when we have requirements prepared. ",
            lastMessageData: "15:10pm"
        },
        {
            username: "Helen Newman",
            photoURL: "https://picsum.photos/seed/picsum/200/300",
            onlineStatus: "DONT_DISTURB",
            lastMessageText:
                "Essentially the brief is for you guys to build an iOS and android app. We will do backend and web app. We have a version one mockup of the UI, please see it attached. As mentioned before, we would simply hand you all the assets for the UI and you guys code. If you have any early questions please do send them on to myself. Ill be in touch in coming days when we have requirements prepared. ",
            lastMessageData: "15:10pm"
        },
        {
            username: "Helen Newman",
            photoURL: "https://picsum.photos/seed/picsum/200/300",
            onlineStatus: "DONT_DISTURB",
            lastMessageText:
                "Essentially the brief is for you guys to build an iOS and android app. We will do backend and web app. We have a version one mockup of the UI, please see it attached. As mentioned before, we would simply hand you all the assets for the UI and you guys code. If you have any early questions please do send them on to myself. Ill be in touch in coming days when we have requirements prepared. ",
            lastMessageData: "15:10pm"
        },
        {
            username: "Helen Newman",
            photoURL: "https://picsum.photos/seed/picsum/200/300",
            onlineStatus: "DONT_DISTURB",
            lastMessageText:
                "Essentially the brief is for you guys to build an iOS and android app. We will do backend and web app. We have a version one mockup of the UI, please see it attached. As mentioned before, we would simply hand you all the assets for the UI and you guys code. If you have any early questions please do send them on to myself. Ill be in touch in coming days when we have requirements prepared. ",
            lastMessageData: "15:10pm"
        },
        {
            username: "Helen Newman",
            photoURL: "https://picsum.photos/seed/picsum/200/300",
            onlineStatus: "DONT_DISTURB",
            lastMessageText:
                "Essentially the brief is for you guys to build an iOS and android app. We will do backend and web app. We have a version one mockup of the UI, please see it attached. As mentioned before, we would simply hand you all the assets for the UI and you guys code. If you have any early questions please do send them on to myself. Ill be in touch in coming days when we have requirements prepared. ",
            lastMessageData: "15:10pm"
        }
    ];

    const [showChannelList, setShowChannelList] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);

    const searchClassname = classNames({
        "search-wrapper": true,
        active: showSearchInput
    });
    return (
        <div className="message-list">
            {showChannelList && isMobile &&
                <Teams showChannelList={showChannelList} setShowChannelList={setShowChannelList} />}
            <div className="list-header">
                {isMobile && (
                    <div className="channel-list-btn" onClick={() => setShowChannelList(!showChannelList)}>
                        <FontAwesomeIcon icon={faChevronLeft} />
                        Open Channel List
                    </div>
                )}
                <div className="title-wrap">
                    <div className="list-title">List of designers</div>
                    <div className={searchClassname}>
                        <div className="search-icon">
                            <FontAwesomeIcon icon={faSearch} onClick={() => setShowSearchInput(!showSearchInput)} />
                        </div>
                        <input type="text" className="search-input" placeholder="Search" />
                    </div>
                </div>
                <div className="message-tabs">
                    <div className="tab-item tab-item-active">All messages</div>
                    <div className="tab-item">Unread</div>
                    <div className="tab-item">Important</div>
                </div>
            </div>
            <div className="chat-list">
                {chatsData.map((chat, i) => (
                    <MessagePreviewItem key={i} previewData={chat} />
                ))}
            </div>
        </div>
    );
}

export default MessageList;
