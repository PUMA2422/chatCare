// client/src/components/ChatMessage.jsx
import React from "react";
import MemoizedReactMarkdown from "./MemoizedReactMarkdown";

export default function ChatMessage({ message }) {
  const text = message?.text ?? "";
  const sender = message?.sender ?? "bot";
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-lg leading-relaxed ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-200 text-gray-900 rounded-bl-none"
        }`}
        style={{ wordBreak: "normal", whiteSpace: "pre-wrap" }}
      >
        <MemoizedReactMarkdown>{text}</MemoizedReactMarkdown>
      </div>
    </div>
  );
}
