// components/MarkdownRenderer.tsx
"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  content: string;
  className?: string; // extra classes for wrapper
  proseClassName?: string; // override prose size/style
  truncate?: boolean; // apply line-clamp on small previews
  clampLines?: 0 | 3 | 4 | 5 | 6; // requires tailwind line-clamp plugin if you use it
};

export default function MarkdownRenderer({
  content,
  className = "",
  proseClassName = "prose prose-sm md:prose",
  truncate = false,
  clampLines = 0,
}: Props) {
  const clampClass =
    truncate && clampLines
      ? `line-clamp-${clampLines}`
      : truncate
      ? "line-clamp-3"
      : "";

  return (
    <div className={`${proseClassName} max-w-none ${clampClass} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h2: ({ node, ...props }) => (
            <h2 {...props} className="mt-6 text-xl scroll-m-20" />
          ),
          code: ({ className, children, ...props }) => {
            const isBlock =
              typeof className === "string" && className.includes("language-");

            if (!isBlock) {
              // inline code
              return (
                <code
                  className={`px-1 py-0.5 rounded bg-gray-100 ${
                    className || ""
                  }`}
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // fenced code block
            return (
              <pre className="overflow-x-auto rounded bg-gray-100 p-3">
                <code className={className || ""} {...props}>
                  {children}
                </code>
              </pre>
            );
          },
        }}
      >
        {content || ""}
      </ReactMarkdown>
    </div>
  );
}
