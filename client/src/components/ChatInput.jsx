import { useState, useRef, useEffect } from "react";
import React from "react";
import { FiSend } from "react-icons/fi";

export default function ChatInput({ onSend, disabled }) {
    const [input, setInput] = useState("");
    const textareaRef = useRef(null);

    const handleSend = () => {
        if (!input.trim() || disabled) return;
        onSend(input);
        setInput("");
    };

    // Auto-expand textarea height
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    }, [input]);

    return (
        <div className="flex items-end p-3 bg-gray-800">
            <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                    }
                }}
                rows={1}
                className={`w-full h-full resize-none px-4 py-2 rounded-xl focus:outline-none text-gray-200 placeholder-gray-400 bg-transparent ${
                    disabled ? "opacity-50 cursor-not-allowed" : ""
                }`}
                placeholder="Type your message... (Shift+Enter for newline)"
                disabled={disabled}
            />

            <button
                onClick={handleSend}
                disabled={disabled || !input.trim()}
                className={`ml-3 p-3 rounded-full flex items-center justify-center transition ${
                    disabled || !input.trim()
                        ? "bg-gray-600 cursor-not-allowed text-gray-400"
                        : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
            >
                <FiSend size={20} />
            </button>
        </div>
    );
}
