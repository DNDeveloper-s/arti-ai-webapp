import Markdown from "react-remarkable";
import React, { useEffect } from "react";

const MarkdownRenderer = ({
  markdownContent,
  className,
}: {
  markdownContent: string;
  className?: string;
}) => {
  return (
    <div className={className ?? "chat-markdown"}>
      <Markdown
        options={{
          html: true,
        }}
        source={markdownContent}
      />
    </div>
  );
};

export default MarkdownRenderer;
