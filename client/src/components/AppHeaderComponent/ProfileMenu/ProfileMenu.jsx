import React, { useState } from "react";
import "./ProfileMenu.scss";
import userIcon from "../../../assets/images/user-icon.svg";
import { useRecoilState } from "recoil";
import { authState, selectedChatId, selectedUserId } from "../../../state/atoms";

function ProfileMenu() {
    const [showMenu, setShowMenu] = useState(false);
    const [auth, setAuth] = useRecoilState(authState);
    const [userId, setUserId] = useRecoilState(selectedUserId)
    const [chatId, setChatId] = useRecoilState(selectedChatId)

    const logout = () => {
        setAuth(null);
        setChatId(null)
        setUserId(null)
        localStorage.removeItem("token");
    };

    return (
        <div className="profile-menu" onClick={() => setShowMenu(!showMenu)}>
            {`${auth.firstName} ${auth.lastName}`}
            <img src={userIcon} alt="user" className="user-icon" />
            {showMenu && (
                <div className="menu-items">
                    <div className="item">Edit my Profile</div>
                    <div className="item" onClick={logout}>Logout</div>
                </div>
            )}
        </div>
    );
}

export default ProfileMenu;
