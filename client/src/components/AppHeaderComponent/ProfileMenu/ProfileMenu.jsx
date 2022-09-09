import React, { useState } from "react";
import "./ProfileMenu.scss";
import userIcon from "../../../assets/images/user-icon.svg";

function ProfileMenu({ props }) {
    const [showMenu, setShowMenu] = useState(false);

    return (
        <div className="profile-menu" onClick={() => setShowMenu(!showMenu)}>
            Rachel Curtis
            <img src={userIcon} alt="user" className="user-icon" />
            {showMenu && (
                <div className="menu-items">
                    <div className="item">Edit my Profile</div>
                    <div className="item">Logout</div>
                </div>
            )}
        </div>
    );
}

export default ProfileMenu;
