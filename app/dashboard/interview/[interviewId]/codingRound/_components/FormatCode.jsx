import React, { useState, useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css"; // You can change the theme here

const FormatCode = ({ code = "", language = "javascript" }) => {
  const [highlightedCode, setHighlightedCode] = useState("");

  useEffect(() => {
    try {
      // Fallback if language isn't supported
      const validLang = hljs.getLanguage(language) ? language : "plaintext";
      const highlighted = hljs.highlight(code, { language: validLang }).value;
      setHighlightedCode(highlighted);
    } catch (err) {
      console.error("Highlighting error:", err);
      setHighlightedCode(code);
    }
  }, [code, language]);

  return (
    <div className="rounded-md overflow-auto bg-[#f6f8fa] p-4 text-sm text-black">
      <pre>
        <code
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
          className={`hljs language-${language}`}
        ></code>
      </pre>
    </div>
  );
};

export default FormatCode;
