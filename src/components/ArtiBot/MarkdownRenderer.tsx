import Markdown from "react-remarkable";
import React, { useEffect } from "react";

const MarkdownRenderer = ({ markdownContent }: { markdownContent: string }) => {
  return (
    <div className="chat-markdown">
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
