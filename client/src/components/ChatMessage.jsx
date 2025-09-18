import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm"; 

function normalizeMarkdown(text) {
  if (!text) return text;

  // collapse runs of spaces so we don't accidentally remove deliberate spacing
  // but first fix spaced markdown tokens:
  // **  something  **  ->  **something**
  text = text.replace(/\*\*\s+([^*][\s\S]*?)\s+\*\*/g, "**$1**");

  // * something * -> *something*
  text = text.replace(/\*\s+([^*][\s\S]*?)\s+\*/g, "*$1*");

  // Also handle underscore-style emphasis (optional)
  text = text.replace(/__\s+([^_][\s\S]*?)\s+__/g, "__$1__");
  text = text.replace(/_\s+([^_][\s\S]*?)\s+_/g, "_$1_");

  return text;
}

export default function ChatMessage({ message, sender }) {
  const isUser = sender === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`px-4 py-2 rounded-2xl max-w-xs ${
          isUser
            ? "bg-blue-500 text-white rounded-br-none break-words whitespace-pre-wrap"
            : "bg-gray-200 text-gray-900 rounded-bl-none break-words whitespace-pre-wrap"
        }`}
      >
        <ReactMarkdown 
        remarkPlugins={[remarkGfm]}
            components={{
            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
            p: ({ children }) => <p className="mb-2">{children}</p>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
            ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
          }}>
          {normalizeMarkdown(message)}
        </ReactMarkdown>
      </div>
    </div>
  );
}