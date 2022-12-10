import React from "react";
import "./SelectChatBanner.scss"

function SelectChatBanner() {
    return (
        <div className="select-chat">
            <div id="arrowAnim">
                <div className="arrowSliding">
                    <div className="arrow"/>
                </div>
                <div className="arrowSliding delay1">
                    <div className="arrow"/>
                </div>
                <div className="arrowSliding delay2">
                    <div className="arrow"/>
                </div>
                <div className="arrowSliding delay3">
                    <div className="arrow"/>
                </div>
            </div>
            Please select chat
        </div>
    );
}

export default SelectChatBanner;