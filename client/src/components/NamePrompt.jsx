// client/src/components/NamePrompt.jsx
import React, { useState } from "react";

export default function NamePrompt({ onSubmit }) {
    const [name, setName] = useState("");

    const handleSubmit = () => {
        const trimmed = (name || "").trim();
        if (!trimmed) return;
        onSubmit(trimmed);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="w-[90%] max-w-sm bg-gray-800 text-white rounded-lg p-6 shadow-lg">
                <h2 className="text-lg font-semibold mb-3">Welcome — what's your name?</h2>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    className="w-full px-3 py-2 rounded bg-gray-700 text-white mb-4 focus:outline-none"
                    placeholder="Enter your name"
                    autoFocus
                />
                <div className="flex justify-end">
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}
