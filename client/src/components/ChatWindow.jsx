import ChatMessage from "./ChatMessage";
import React from "react";

export default function ChatWindow({ messages, userName }) {
    return (
        <div className="flex-1 flex flex-col overflow-y-auto bg-gray-900 text-white">
            {messages.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center text-center p-4">
                    <h1 className="text-2xl font-bold mb-2">
                        {userName ? `Welcome, ${userName}!` : "Welcome to ChatCare"}
                    </h1>
                    <p className="text-gray-400">
                        Ask a health question or start a conversation.
                    </p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto p-4">
                    {messages.map((msg, idx) => (
                        <ChatMessage key={idx} message={msg} />
                    ))}
                </div>
            )}
        </div>
    );
}
