import React, { useEffect, useState } from "react";
import "./ProfileInformation.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronLeft, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import { selectedChatId } from "../../state/atoms";
import { useLazyQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "../../graphql/user";

function ProfileInformation({ isTablet, isSmallMobile }) {
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [profile, setProfile] = useState({
        email: "",
        firstName: "",
        id: "",
        lastName: "",
        phoneNo: ""
    })
    const [chatId] = useRecoilState(selectedChatId)
    const [getUserQuery] = useLazyQuery(GET_USER_BY_ID)
    const navigate = useNavigate();

    useEffect(() => {
        if (chatId) {
            getUserById()
        }
    }, [chatId])

    const getUserById = async () => {
        const user = await getUserQuery({
            variables: {
                id: chatId,
            }
        })
        setProfile(user.data.getUserById)
    }
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
                    <div className="user-name">{`${profile.firstName} ${profile.lastName}`}</div>
                    <div className="user-address">New York, USA</div>
                </div>
                <div className="additional-information">
                    <div className="block-info">
                        <div>Email</div>
                        <div>{profile.email}</div>
                        <div>Phone number</div>
                        <div>{profile.phoneNo}</div>
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
