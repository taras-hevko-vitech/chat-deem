import React, { useEffect, useState } from "react";
import "./MessageList.scss";
import MessagePreviewItem from "./MessagePreviewItem/MessagePreviewItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faSearch } from "@fortawesome/free-solid-svg-icons";
import Teams from "../Teams/Teams";
import classNames from "classnames";
import { useLazyQuery } from "@apollo/client";
import { GET_USERS } from "../../graphql/user";

function MessageList({ isMobile }) {
    const [searchValue, setSearchValue] = useState("")
    const [showChannelList, setShowChannelList] = useState(false);
    const [showSearchInput, setShowSearchInput] = useState(false);
    const [allUsers, setAllUsers] = useState([]);
    const [allUsersQuery] = useLazyQuery(GET_USERS);

    const getAllUsers = async () => {
        const response = await allUsersQuery();
        if (response.data.getAllUsers) {
            setAllUsers(response.data.getAllUsers);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    useEffect(() => {
        handleSearchChange()
    }, [searchValue])

    const searchClassname = classNames({
        "search-wrapper": true,
        active: showSearchInput
    });

    const handleSearchChange = () => {
        if (searchValue.length === 0) {
            getAllUsers();
        }
        const filteredUsers = allUsers.filter(user => {
            const name = user.firstName.toLowerCase();
            const lastName = user.lastName.toLowerCase();
            if (name.includes(searchValue) || lastName.includes(searchValue)) {
                return user
            }
        })
        setAllUsers(filteredUsers)
    }
    const handleKeyDown = event => {
        if (event.key === "Escape") {
            setShowSearchInput(false)
            setSearchValue("")
            getAllUsers()
        }
    };
    return (
        <div className="message-list">
            {showChannelList && isMobile && <Teams showChannelList={showChannelList} setShowChannelList={setShowChannelList} />}
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
                        <input type="text" className="search-input" placeholder="Search" value={searchValue} onChange={e => setSearchValue(e.target.value.toLowerCase())} onKeyDown={handleKeyDown}/>
                    </div>
                </div>
                <div className="message-tabs">
                    <div className="tab-item tab-item-active">All messages</div>
                    <div className="tab-item">Unread</div>
                    <div className="tab-item">Important</div>
                </div>
            </div>
            <div className="chat-list">
                {allUsers.map((chat, i) => (
                    <MessagePreviewItem key={i} previewData={chat} isMobile={isMobile}/>
                ))}
            </div>
        </div>
    );
}

export default MessageList;
