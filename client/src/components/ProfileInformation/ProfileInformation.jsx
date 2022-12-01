import React, { useState } from "react";
import "./ProfileInformation.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronLeft, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import { selectedChat } from "../../state/atoms";

function ProfileInformation({ isTablet, isSmallMobile }) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [chat] = useRecoilState(selectedChat)
    const navigate = useNavigate();
    console.log(chat);
    if (isTablet) {
        return (
            <>
                <div className="profile-information-mobile">
                    <div className="left">
                        {isSmallMobile && <FontAwesomeIcon icon={faChevronLeft} onClick={() => navigate("/")} />}
                        <img src="https://picsum.photos/seed/picsum/200/300" alt="" className="avatar" />
                        <div>
                            <div className="user-name">Rachel Curtis</div>
                            <div className="online-status">online</div>
                        </div>
                    </div>
                    <FontAwesomeIcon
                        icon={showProfileMenu ? faChevronUp : faChevronDown}
                        onClick={() => {
                            setShowProfileMenu(!showProfileMenu);
                        }}
                    />
                </div>
                {showProfileMenu && (
                    <div className="user-info">
                        <div className="title">Profile Information</div>
                        <div className="profile-link">Show full profile</div>
                        <div className="block-info">
                            <div>Email: {'user.email'}</div>
                            <div>Phone number: {'user.phoneNo'}</div>
                            <div>Date of birth: January 20, 1990</div>
                            <div>Gender: Female</div>
                            <div>Languages: English, French</div>
                        </div>
                    </div>
                )}
            </>
        );
    } else {
        return (
            <div className="profile-information">
                <div className="main-info">
                    <img src="https://picsum.photos/seed/picsum/200/300" alt="" className="avatar" />
                    <div className="user-name">{`${"user.firstName"} ${"user.lastName"}`}</div>
                    <div className="user-address">New York, USA</div>
                </div>
                <div className="additional-information">
                    <div className="block-info">
                        <div>Email</div>
                        <div>{"user.email"}</div>
                        <div>Phone number</div>
                        <div>{"user.phoneNo"}</div>
                    </div>
                    <div className="block-info">
                        <div>Date of birth</div>
                        <div>January 20, 1990</div>
                        <div>Gender</div>
                        <div>Female</div>
                        <div>Languages</div>
                        <div>English, French</div>
                        <div className="profile-link">Show full profile</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileInformation;
