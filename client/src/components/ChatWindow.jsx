import ChatMessage from "./ChatMessage";
import React from "react";

export default function ChatWindow({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-900 text-white">
      {messages.map((msg, idx) => (
        <ChatMessage key={idx} message={msg.text} sender={msg.sender} />
      ))}
    </div>
  );
}