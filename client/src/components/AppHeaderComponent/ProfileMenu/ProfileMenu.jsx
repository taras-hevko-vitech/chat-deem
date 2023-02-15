import React, { useState } from "react";
import "./ProfileMenu.scss";
import userIcon from "../../../assets/images/user-icon.svg";
import { useRecoilState } from "recoil";
import { authState, selectedChatId, selectedUserId } from "../../../state/atoms";
import { useMutation } from "@apollo/client";
import { REMOVE_ONLINE_STATUS } from "../../../graphql/user";

function ProfileMenu() {
    const [showMenu, setShowMenu] = useState(false);
    const [auth, setAuth] = useRecoilState(authState);
    const [userId, setUserId] = useRecoilState(selectedUserId)
    const [chatId, setChatId] = useRecoilState(selectedChatId)
    const [removeOnlineStatusMutation] = useMutation(REMOVE_ONLINE_STATUS)

    const logout = async () => {
        await removeOnlineStatusMutation()
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
