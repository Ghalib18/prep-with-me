"use client";

import React, { useEffect, useRef, useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Check, Copy } from "lucide-react";
import { toast } from "sonner";

const CodeEditor = ({ onValueChange, language, initialCode = "" }) => {
  const editorRef = useRef(null);
  const [copied, setCopied] = useState(false);

  const getMonacoLang = (lang) => {
    const l = (lang || "").toLowerCase();
    if (l.includes("py")) return "python";
    if (l.includes("java") && !l.includes("script")) return "java";
    if (l.includes("script") || l.includes("js")) return "javascript";
    if (l.includes("ts")) return "typescript";
    if (l.includes("c++") || l.includes("cpp")) return "cpp";
    if (l.includes("go")) return "go";
    return "javascript";
  };

  const monacoLanguage = getMonacoLang(language);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

    // Listen to changes in real-time so the user doesn't have to manually click Save!
    editor.onDidChangeModelContent(() => {
      const code = editor.getValue();
      onValueChange(code);
    });

    // Initial trigger
    const initial = editor.getValue();
    if (initial) {
      onValueChange(initial);
    }
  };

  const handleReset = () => {
    if (editorRef.current) {
      const defaultStarter = `// Write your ${language || "code"} solution here\n\n`;
      editorRef.current.setValue(defaultStarter);
      onValueChange(defaultStarter);
      toast.info("Editor reset to starter template");
    }
  };

  const handleCopy = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      navigator.clipboard.writeText(code);
      setCopied(true);
      toast.success("Code copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    // Configure custom Monaco dark theme
    loader.init().then((monaco) => {
      monaco.editor.defineTheme("aiCodeTheme", {
        base: "vs-dark",
        inherit: true,
        rules: [
          { token: "comment", foreground: "64748b", fontStyle: "italic" },
          { token: "keyword", foreground: "a855f7", fontStyle: "bold" },
          { token: "string", foreground: "38bdf8" },
          { token: "number", foreground: "fbbf24" },
        ],
        colors: {
          "editor.background": "#030712",
          "editor.foreground": "#e2e8f0",
          "editor.lineHighlightBackground": "#0f172a",
          "editorCursor.foreground": "#6366f1",
          "editorIndentGuide.background": "#1e293b",
          "editor.selectionBackground": "#312e81",
        },
      });
      monaco.editor.setTheme("aiCodeTheme");
    });
  }, []);

  const defaultStarter =
    initialCode || `// Write your ${language || "code"} solution here\n\n`;

  return (
    <div className="flex flex-col h-full rounded-2xl overflow-hidden border border-border bg-slate-950 shadow-md">
      {/* Editor Sub-header Bar */}
      <div className="flex items-center justify-between bg-slate-900/90 px-4 py-2 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
          <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
          <span className="ml-2 font-mono text-slate-300 font-medium">
            Solution.{monacoLanguage === "python" ? "py" : monacoLanguage === "java" ? "java" : monacoLanguage === "cpp" ? "cpp" : "js"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-800"
            title="Copy Code"
          >
            {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors p-1 rounded hover:bg-slate-800"
            title="Reset to starter"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Monaco Container */}
      <div className="w-full flex-1 min-h-[500px]">
        <Editor
          height="100%"
          minHeight="500px"
          language={monacoLanguage}
          defaultValue={defaultStarter}
          theme="aiCodeTheme"
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            fontFamily: "var(--font-mono), Consolas, 'Courier New', monospace",
            lineNumbers: "on",
            renderLineHighlight: "all",
            smoothScrolling: true,
          }}
        />
      </div>
    </div>
  );
};

export default CodeEditor;