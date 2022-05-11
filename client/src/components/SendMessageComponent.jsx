import React, { useState } from 'react';

function SendMessageComponent({ sendMessage }) {
    const [text, setText] = useState("")
    return (
        <div className="send-form">
            <form onSubmit={(e) => {
                e.preventDefault()
                sendMessage(text, e)
                setText("")
            }}>
                <input
                    type="text"
                    value={text}
                    placeholder="Hi,"
                    onChange={e => setText(e.target.value)}
                />
                <button type="submit">Надіслати</button>
            </form>
        </div>
    );
}

export default SendMessageComponent;