import React from 'react';
import "./ProfileMenu.scss"
import userIcon from "../../../assets/images/user-icon.svg"

function ProfileMenu({ props }) {
    return (
        <div className="profile-menu">
            Rachel Curtis
            <img src={userIcon} alt="user" className="user-icon"/>
        </div>
    );
}

export default ProfileMenu;