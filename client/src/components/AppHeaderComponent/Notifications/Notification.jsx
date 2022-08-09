import React from 'react';
import "./Notification.scss"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faStar, faBell, faQuestion} from "@fortawesome/free-solid-svg-icons"


function Notification({ props }) {
    return (
        <div className="notification-list">
            <div className="icon-wrap">
                <FontAwesomeIcon icon={faStar} />
            </div>
            <div className="icon-wrap">
                <FontAwesomeIcon icon={faBell} />
            </div>
            <div className="icon-wrap">
                <FontAwesomeIcon icon={faQuestion} />
            </div>
        </div>
    );
}

export default Notification;