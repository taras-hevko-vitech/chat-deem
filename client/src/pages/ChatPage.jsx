import React, { useRef, useState } from 'react';
import Chat from "../components/Chat";
import SendMessageComponent from "../components/SendMessageComponent";

function ChatPage() {
    const [messages, setMessages] = useState([])
    const [connected, setConnected] = useState(false)
    const [username, setUsername] = useState("")
    const socket = useRef(null)

    const connect = () => {
        socket.current = new WebSocket('ws://localhost:5003')

        socket.current.onopen = () => {
            setConnected(true)
            const message = {
                event: 'connection',
                username,
                id: Date.now()
            }
            console.log("Connected")
            socket.current.send(JSON.stringify(message))
        }
        socket.current.onmessage = (event) => {
            const message = JSON.parse(event.data)
            setMessages(prev => [message, ...prev])
        }
        socket.current.onclose = () => {
            console.log('Socket закрыт')
        }
        socket.current.onerror = () => {
            console.log('Socket произошла ошибка')
        }
    }

    const sendMessage = async (value, event) => {
        const message = {
            username,
            message: value,
            id: Date.now(),
            event: 'message'
        }
        socket.current.send(JSON.stringify(message));
    }

    if (!connected) {
        return (
            <div>
                <input
                    type="text"
                    placeholder="Введіть своє Ім'я"
                    onChange={(e) => {
                        setUsername(e.target.value)
                    }}
                    value={username}
                />
                <button type="submit" onClick={connect}>Давайте чатитись</button>
            </div>
        )
    }
    return (
        <div className="chat-page">
            <Chat messages={messages}/>
            <SendMessageComponent sendMessage={sendMessage}/>
        </div>
    );
}

export default ChatPage;