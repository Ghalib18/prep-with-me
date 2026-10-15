"use client";

import React, { useState, useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css";
import { Check, Copy } from "lucide-react";
import { toast } from "sonner";

const FormatCode = ({ code = "", language = "javascript" }) => {
  const [highlightedCode, setHighlightedCode] = useState("");
  const [copied, setCopied] = useState(false);

  const rawLang = typeof language === "string" ? language : "javascript";
  const rawCode =
    typeof code === "string"
      ? code
      : typeof code === "object"
      ? JSON.stringify(code, null, 2)
      : String(code || "");

  const cleanLang = (rawLang || "javascript")
    .toLowerCase()
    .replace("c++", "cpp")
    .trim();

  useEffect(() => {
    try {
      const validLang = hljs.getLanguage(cleanLang) ? cleanLang : "plaintext";
      const highlighted = hljs.highlight(rawCode || "// No code available", {
        language: validLang,
      }).value;
      setHighlightedCode(highlighted);
    } catch (err) {
      console.error("Highlighting error:", err);
      setHighlightedCode(rawCode);
    }
  }, [rawCode, cleanLang]);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCode);
    setCopied(true);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const getFileExt = (l) => {
    if (l === "python") return "py";
    if (l === "java") return "java";
    if (l === "cpp") return "cpp";
    if (l === "typescript" || l === "ts") return "ts";
    return "js";
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md w-full max-w-full">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between bg-slate-900/90 px-4 py-2 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
          <span className="ml-2 font-mono text-slate-300 font-medium">
            solution.{getFileExt(cleanLang)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors px-2.5 py-1 rounded-lg"
          title="Copy Code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5 text-slate-400" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto max-w-full text-xs font-mono leading-relaxed">
        <pre>
          <code
            dangerouslySetInnerHTML={{ __html: highlightedCode }}
            className={`hljs language-${cleanLang}`}
          />
        </pre>
      </div>
    </div>
  );
};

export default FormatCode;
