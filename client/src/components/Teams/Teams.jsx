import React from 'react';
import "./Teams.scss"
import plusIcon from "../../assets/images/icon-add.png"
import ChannelsList from "./ChannelsList";

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
                    <img src={plusIcon} alt="plus" className="plus-icon"/>
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