// App.jsx (replace your handleSend & add helper in this file)
import React, { useState } from "react";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";

// Helper: smart join of previous text + incoming chunk
function joinChunks(prevText, chunk) {
  if (!prevText) return chunk || "";
  if (!chunk) return prevText;

  // convert escaped newlines (if the model returns backslash+n)
  chunk = chunk.replace(/\\n/g, "\n");

  // if chunk starts with whitespace, just append
  if (/^\s/.test(chunk)) return prevText + chunk;

  // if prevText already ends with whitespace, just append
  if (/\s$/.test(prevText)) return prevText + chunk;

  // if chunk begins with punctuation that should not have space before it, append directly
  if (/^[.,!?;:)\]}]/.test(chunk)) return prevText + chunk;

  // otherwise insert single space
  return prevText + " " + chunk;
}

export default function App() {
  const [messages, setMessages] = useState([
    { text: "Hi, I’m Botzy! How can I help you today?", sender: "bot" },
  ]);

// inside App.jsx
  const handleSend = async (text) => {
    const newMessage = { text, sender: "user" };
    setMessages((prev) => [...prev, newMessage]);

    // unique id for this streaming assistant message
    const streamId = Date.now().toString();

    // add placeholder assistant message (we will update it as chunks arrive)
    setMessages((prev) => [...prev, { text: "", sender: "bot", id: streamId }]);

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

      // streaming loop: append each plain chunk to accumulated and update the placeholder
      while (!done) {
        const { done: doneReading, value } = await reader.read();
        done = doneReading;
        if (value) {
          // decode chunk (plain text forwarded by server)
          const chunk = decoder.decode(value, { stream: true });

          // convert escaped newlines like "\\n" into real newlines
          const norm = chunk.replace(/\\n/g, "\n");

          accumulated += norm;

          // Update only the message with the matching streamId. Append a small cursor while streaming.
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === streamId
                ? { ...msg, text: accumulated + "▍" } // cursor
                : msg
            )
          );
        }
      }

      // final update: remove cursor
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamId ? { ...msg, text: accumulated } : msg
        )
      );
    } catch (error) {
      console.error("Error talking to server:", error);
      // replace the placeholder message (if it exists) with an error notice
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === streamId
            ? { ...msg, text: "⚠️ Botzy is offline right now." }
            : msg
        )
      );
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
