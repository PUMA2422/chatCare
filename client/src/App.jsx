import { useState } from "react";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import React from "react";

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hi, I’m Botzy! How can I help you today?", sender: "bot" },
  ]);

  const handleSend = async (text) => {
    const newMessage = { text, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);

    try {
      const res = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { text: data.reply, sender: "bot" },
      ]);
    } catch (error) {
      console.error("Error talking to server:", error);
      setMessages((prev) => [
        ...prev,
        { text: "⚠️ Botzy is offline right now.", sender: "bot" },
      ]);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <ChatWindow messages={messages} />
      <ChatInput onSend={handleSend} />
    </div>
  );
}