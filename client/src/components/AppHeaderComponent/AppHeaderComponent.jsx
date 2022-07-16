import React from 'react';
import "./AppHeaderComponent.scss"
import Navigation from "./Navigation/Navigation";
import Notification from "./Notifications/Notification";
import ProfileMenu from "./ProfileMenu/ProfileMenu";

function AppHeaderComponent({ props }) {
    return (
        <div className="app-header">
            <div className="container">
                <div className="content">
                    <Navigation/>
                    <div className="right-menu">
                        <Notification/>
                        <ProfileMenu/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AppHeaderComponent;