// client/src/components/MemoizedReactMarkdown.jsx
import React, { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

// Memoized wrapper for ReactMarkdown
const MemoizedReactMarkdown = memo(
  ({ children }) => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        components={{
          p: ({ children }) => <p className="mb-2">{children}</p>,
          ol: ({ children }) => <ol className="list-decimal list-inside mb-2">{children}</ol>,
          ul: ({ children }) => <ul className="list-disc list-inside mb-2">{children}</ul>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          code({ inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline ? (
              <pre className="overflow-auto rounded-md p-2 bg-gray-800 text-white">
                <code className={className} {...props}>{children}</code>
              </pre>
            ) : (
              <code className="rounded bg-gray-200 px-1" {...props}>{children}</code>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    );
  },
  // re-render only if markdown text actually changes
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

export default MemoizedReactMarkdown;
