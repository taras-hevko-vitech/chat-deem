import React from 'react';
import "./ProfileInformation.scss"

function ProfileInformation({ props }) {
    return (
        <div className="profile-information">
            <div className="main-info">
                <img src="https://picsum.photos/seed/picsum/200/300" alt="" className="avatar"/>
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

export default ProfileInformation;