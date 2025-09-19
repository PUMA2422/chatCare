// client/src/components/ChatMessage.jsx
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

export default function ChatMessage({ message }) {
  // message is an object: { text, sender, id? }
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
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p: ({ children }) => <p className="mb-2">{children}</p>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
            ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
            code({ node, inline, className, children, ...props }) {
              // simple fallback for inline and fenced code.
              // If you have a CodeBlock component, replace this with it.
              const match = /language-(\w+)/.exec(className || "");
              return !inline ? (
                <pre className="overflow-auto rounded-md p-2 bg-gray-800 text-white"><code className={className} {...props}>{children}</code></pre>
              ) : (
                <code className="rounded bg-gray-200 px-1" {...props}>{children}</code>
              );
            },
          }}
        >
          {text}
        </ReactMarkdown>
      </div>
    </div>
  );
}
