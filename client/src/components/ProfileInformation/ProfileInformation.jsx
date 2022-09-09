import React, { useState } from "react";
import "./ProfileInformation.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronLeft, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

function ProfileInformation({ isMobile, isTablet, isSmallMobile }) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();
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
                            <div>Nickname: Silentgirl</div>
                            <div>Email: rachelcurtis@itzpromo.com</div>
                            <div>Phone number: (805) 651-9088</div>
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
                    <div className="user-name">Rachel Curtis</div>
                    <div className="user-address">New York, USA</div>
                </div>
                <div className="additional-information">
                    <div className="block-info">
                        <div>Nickname</div>
                        <div>Silentgirl</div>
                        <div>Email</div>
                        <div>rachelcurtis@itzpromo.com</div>
                        <div>Phone number</div>
                        <div>(805) 651-9088</div>
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
