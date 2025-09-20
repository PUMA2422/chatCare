// App.jsx
import React, { useState } from "react";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import NamePrompt from "./components/NamePrompt";

export default function App() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false); // track if bot is responding
    const [userName, setUserName] = useState(() => {
        return "";
    });

    const handleSetUserName = (name) => {
        setUserName(name);
        try {
            localStorage.setItem("chatcare_user", name);
        } catch (e) {
            /* ignore storage errors */
        }
    };

    const handleSend = async (text) => {
        const newMessage = { text, sender: "user" };
        setMessages((prev) => [...prev, newMessage]);

        const streamId = Date.now().toString();
        setMessages((prev) => [...prev, { text: "", sender: "bot", id: streamId }]);

        setLoading(true); // 🚀 disable input while streaming

        try {
            const res = await fetch("http://localhost:5000/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
            });

            if (!res.ok) {
                const errText = await res.text().catch(() => "Server error");
                throw new Error(errText || "Chat server error");
            }

            const reader = res.body.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let accumulated = "";

            while (!done) {
                const { done: doneReading, value } = await reader.read();
                done = doneReading;
                if (value) {
                    const chunk = decoder.decode(value, { stream: true });
                    const norm = chunk.replace(/\\n/g, "\n");
                    accumulated += norm;

                    setMessages((prev) =>
                        prev.map((msg) =>
                            msg.id === streamId
                                ? { ...msg, text: accumulated + "▍" }
                                : msg
                        )
                    );
                }
            }

            // Final update
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === streamId ? { ...msg, text: accumulated } : msg
                )
            );
        } catch (error) {
            console.error("Error talking to server:", error);
            setMessages((prev) =>
                prev.map((msg) =>
                    msg.id === streamId
                        ? { ...msg, text: "⚠️ Botzy is offline right now." }
                        : msg
                )
            );
        } finally {
            setLoading(false); // ✅ re-enable input after response is done
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-900">
            {!userName && <NamePrompt onSubmit={handleSetUserName} />}
            <Header />
            <div className="flex-1">
                <ChatWindow messages={messages} userName={userName} />
            </div>

            <ChatInput onSend={handleSend} disabled={loading} />
        </div>
    );

}
