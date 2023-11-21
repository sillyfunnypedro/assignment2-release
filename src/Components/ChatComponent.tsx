import React, { useState, useEffect, useCallback, useRef } from "react";

import { MessageContainer } from "../Engine/GlobalDefinitions";

import ChatClient from "../Engine/ChatClient";
import './ChatComponent.css'


const chatClient = new ChatClient();


function ChatComponent() {
    const [messages, setMessages] = useState<MessageContainer[]>([]);
    const [mostRecentId, setMostRecentId] = useState<number>(0);
    const [user] = useState<string>(() => window.sessionStorage.getItem('userName') || "");
    const [message, setMessage] = useState<string>("Hello World");
    const bottomRef = useRef(null);
    const [isMinimized, setIsMinimized] = useState(false);

    const toggleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    let localUser = user;
    let localMessage = message;
    const updateDisplay = useCallback(() => {
    if (chatClient.messages.length !== messages.length) {
        setMessages([...chatClient.messages]);
    }
}, [messages]);


    useEffect(() => {
        chatClient.setCallback(updateDisplay);
    }, [updateDisplay]);


    function makeFormatedMessages() {

        let formatedMessages = [...messages].reverse().map((message, index, array) => {
            if (index === array.length - 1) { // if this is the last message
                return <textarea id='chatMessageText' key={index} readOnly value={message.id + "]" + message.user + ": " + message.message} ref={bottomRef} />
            } else {
                return <textarea id='chatMessageText' key={index} readOnly value={message.id + "]" + message.user + ": " + message.message} />
            }
        });
        return formatedMessages;
    }    

    return (
        <div>
            <h1>Chat</h1>
            <button id='getMessageBtn' onClick={() => chatClient.getNextMessages()}>Get Messages</button>
            <div className="view-container">
                {!isMinimized && (
                    <div className="scrollable-text-view">
                        {makeFormatedMessages()}
                    </div>
                )}

                <div className="input-container">
                    <div className="chat-controls">
                        <button onClick={toggleMinimize}>
                            {isMinimized ? 'Maximize' : 'Minimize'}
                        </button>
                        <button onClick={() => chatClient.getNextMessages()}>Get Messages</button>
                    </div>
                    <input
                        type="text"
                        id="message"
                        placeholder={message}
                        onKeyUp={(event) => {
                            localMessage = event.currentTarget.value;
                            setMessage(event.currentTarget.value);
                            if (event.key === "Enter") {
                                chatClient.sendMessage(localUser, localMessage);
                                event.currentTarget.value = "";
                                setMessage("");
                            }
                        }}
                    />
                    <button id='sendBtn' onClick={() => chatClient.sendMessage(localUser, localMessage)}>Send</button>
                </div>
            </div>
        </div>
    );
    
    


    
    
}

export default ChatComponent;
