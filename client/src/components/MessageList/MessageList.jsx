import React, { useEffect, useState } from "react";
import "./MessageList.scss";
import MessagePreviewItem from "./MessagePreviewItem/MessagePreviewItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import Teams from "../Teams/Teams";
import classNames from "classnames";
import { useSubscription } from "@apollo/client";
import { UPDATE_USERS_SUBSCRIPTION } from "../../graphql/user";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { useRecoilState } from "recoil";
import { authState } from "../../state/atoms";

function MessageList() {
    const {width} = useWindowDimensions()
    const [auth] = useRecoilState(authState)
    const [searchValue, setSearchValue] = useState("");
    const [showChannelList, setShowChannelList] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [allUsers, setAllUsers] = useState([]);

    useSubscription(UPDATE_USERS_SUBSCRIPTION, {
        onSubscriptionData({ subscriptionData: { data}}) {
            if (data.updateAllUsers) {
                setAllUsers(removeAuthUserFromList(data.updateAllUsers))
            }
        }
    });

    const removeAuthUserFromList = (users) => {
        return users.filter(user => user.id !== auth.id)
    }

    useEffect(() => {
        handleSearchChange();
    }, [searchValue]);

    const searchClassname = classNames({
        "search-wrapper": true,
        active: showSearchInput
    });

    const handleSearchChange = () => {
        const filteredUsers = allUsers.filter(user => {
            const name = user.firstName.toLowerCase();
            const lastName = user.lastName.toLowerCase();
            if (name.includes(searchValue) || lastName.includes(searchValue)) {
                return user;
            }
        });
    };
    const handleKeyDown = event => {
        if (event.key === "Escape") {
            setShowSearchInput(false);
            setSearchValue("");
        }
    };

    function sortUsersByOnlineStatus(users) {
        return users.sort((userA, userB) => {
            if (userA.isOnline && !userB.isOnline) {
                return -1;
            } else if (!userA.isOnline && userB.isOnline) {
                return 1;
            } else {
                return 0;
            }
        });
    }
    const isMobile = width < 960;

    const sortedUsersByStatus = sortUsersByOnlineStatus(allUsers)

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
                        <input
                            type="text"
                            className="search-input"
                            placeholder="Search"
                            value={searchValue}
                            onChange={e => setSearchValue(e.target.value.toLowerCase())} onKeyDown={handleKeyDown}
                        />
                    </div>
                </div>
                <div className="message-tabs">
                    <div className="tab-item tab-item-active">All messages</div>
                    <div className="tab-item">Unread</div>
                    <div className="tab-item">Important</div>
                </div>
            </div>
            <div className="chat-list">
                {sortedUsersByStatus.map((chat, i) => (
                    <MessagePreviewItem key={i} previewData={chat} />
                ))}
            </div>
        </div>
    );
}

export default MessageList;
