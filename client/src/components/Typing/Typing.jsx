import "./Typing.scss"

import React from "react";

function Typing() {
    return (
        <div className="typing-container">
            <img src="https://picsum.photos/seed/picsum/200/300" className="avatar"/>
            <div className="typing">
                <div className="typing__dot" />
                <div className="typing__dot" />
                <div className="typing__dot" />
            </div>
        </div>
    );
}

export default Typing;