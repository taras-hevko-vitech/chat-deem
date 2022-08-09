import React from 'react';
import "./Teams.scss"
import ChannelsList from "./ChannelsList";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faUserPlus} from "@fortawesome/free-solid-svg-icons"


function Teams({ props }) {
    const teamsList = [
        {
            title: "#designers",
            messageCount: 9
        },
        {
            title: "#programmers",
            messageCount: 10
        },
        {
            title: "#marketers",
            messageCount: 9
        },
        {
            title: "#copyrighters",
            messageCount: 3
        },
        {
            title: "#managers",
            messageCount: 2
        },
    ]

    return (
        <div className="teams">
            <div className="container">
                <div className="teams-header">
                    <div className="title">Teams</div>
                    <div className="plus-icon">
                        <FontAwesomeIcon icon={faUserPlus} />
                    </div>
                </div>
            </div>
            <div>
                {teamsList.map((team, i) => (
                    <div className="topic" key={i}>
                        <div className="topic-title">{team.title}</div>
                        <div>{team.messageCount}</div>
                    </div>
                ))}
            </div>
            <ChannelsList />
        </div>
    );
}

export default Teams;