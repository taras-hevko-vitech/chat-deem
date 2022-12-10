import React from "react";
import plusIcon from "../../assets/images/icon-add.png";

function ChannelsList() {
    const channelsList = [
        {
            title: "#app-idea",
            messageCount: 9
        },
        {
            title: "#general",
            messageCount: 10
        },
        {
            title: "#our clients",
            messageCount: 9
        }
    ];

    return (
        <div className="channels">
            <div className="container">
                <div className="channels-header">
                    <div className="title">Group channels</div>
                    <img src={plusIcon} alt="plus" className="plus-icon" />
                </div>
            </div>
            <div>
                {channelsList.map((channel, i) => (
                    <div className="topic" key={i}>
                        <div className="topic-title">{channel.title}</div>
                        <div>{channel.messageCount}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ChannelsList;
