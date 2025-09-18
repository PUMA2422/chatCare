import { useState } from "react";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import React from "react";

// Helper: smart join of previous text + incoming chunk
function joinChunks(prevText, chunk) {
  if (!prevText) return chunk || "";
  if (!chunk) return prevText;

  // if chunk starts with whitespace, just append
  if (/^\s/.test(chunk)) return prevText + chunk;

  // if prevText already ends with whitespace, just append
  if (/\s$/.test(prevText)) return prevText + chunk;

  // if chunk begins with punctuation that should not have a space before it, append directly
  if (/^[.,!?;:)\]}]/.test(chunk)) return prevText + chunk;

  // otherwise, insert a space between words
  return prevText + " " + chunk;
}


export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hi, I’m Botzy! How can I help you today?", sender: "bot" },
  ]);

const handleSend = async (text) => {
  const newMessage = { text, sender: "user" };
  setMessages((prev) => [...prev, newMessage]);

  // Create a unique ID for this bot response
  const streamId = Date.now().toString();

  // Add an empty placeholder message for the bot that we'll fill live
  setMessages((prev) => [
    ...prev,
    { text: "", sender: "bot", id: streamId }
  ]);

  try {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split("\n\n");
      buffer = parts.pop();

      for (const part of parts) {
        if (part.startsWith("data: ")) {
          const chunk = part.replace("data: ", "").trim();

          if (chunk === "[DONE]") {
            return; // finished streaming
          }

          // Update only the message with this streamId
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamId
                ? { ...msg, text: joinChunks(msg.text, chunk) }
                : msg
            )
          );
        }
      }
    }
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