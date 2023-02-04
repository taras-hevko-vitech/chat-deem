import React, { useEffect, useState } from "react";
import "./ProfileInformation.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronLeft, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { useRecoilState } from "recoil";
import { selectedChatId, selectedUserId } from "../../state/atoms";
import { useLazyQuery } from "@apollo/client";
import { GET_USER_BY_ID } from "../../graphql/user";
import useWindowDimensions from "../../hooks/useWindowDimensions";

function ProfileInformation() {
    const {width} = useWindowDimensions()
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [profile, setProfile] = useState({
        email: "",
        firstName: "",
        id: "",
        lastName: "",
        phoneNo: ""
    });
    const [userId] = useRecoilState(selectedUserId);
    const [getUserQuery] = useLazyQuery(GET_USER_BY_ID);
    const navigate = useNavigate();

    useEffect(() => {
        if (userId) {
            getUserById();
        }
    }, [userId]);

    const getUserById = async () => {
        const user = await getUserQuery({
            variables: {
                id: userId
            }
        });
        setProfile(user.data.getUserById);
    };

    const isSmallMobile = width < 686;
    const isTablet = width < 1100

    if (isTablet) {
        return (
            <>
                <div className="profile-information-mobile">
                    <div className="left">
                        {isSmallMobile && <FontAwesomeIcon icon={faChevronLeft} onClick={() => navigate("/")} />}
                        <img src="https://picsum.photos/seed/picsum/200/300" alt="" className="avatar" />
                        <div>
                            <div className="user-name">{`${profile.firstName} ${profile.lastName}`}</div>
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
                            <div>Email: {profile.email}</div>
                            <div>Phone number: {profile.phoneNo}</div>
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
                </div>
                <div className="additional-information">
                    <div className="block-info">
                        <div>Email</div>
                        <div>{profile.email}</div>
                        <div>Phone number</div>
                        <div>{profile.phoneNo}</div>
                    </div>
                    <div className="block-info">
                        <div className="profile-link">Show full profile</div>
                    </div>
                </div>
            </div>
        );
    }
}

export default ProfileInformation;
