"use client";

import React, { useEffect, useRef, useState } from "react";
import Editor, { loader } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";

const CodeEditor = ({ onValueChange, language }) => {
  const editorRef = useRef(null);
  const [output, setOutput] = useState("");
  const [value, setValue] = useState();

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  useEffect(() => {
    setValue(language?.toLowerCase());
  }, [language]);

  const extractCode = () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      onValueChange(code); // This will pass the value of code in parent element
    }
  };

  const runCode = () => {
    const code = editorRef.current.getValue();
    try {
      // Using new Function to execute the code (for demonstration purposes only)
      const result = new Function(code)();
      setOutput(result);
    } catch (err) {
      setOutput(err.toString());
    }
  };

  useEffect(() => {
    // Load the monaco instance
    loader.init().then((monaco) => {
      // Define the custom theme
      monaco.editor.defineTheme("myCustomTheme", {
        base: "hc-black", // you can also use 'vs' or 'hc-black'
        inherit: true, // will inherit the base theme
        rules: [],
        colors: {
          "editor.background": "#030712", // Background color
          "editor.foreground": "#cbd5e1", // Default text color
          "editor.lineHighlightBackground": "#082f49", // Line highlight color
          "editorCursor.foreground": "#22d3ee", // Cursor color
          "editorIndentGuide.background": "#444444", // Indentation guide color
          "editor.selectionBackground": "#0ea5e9", // Selection color
          // Add more customization as needed
        },
      });

      // Apply the custom theme
      monaco.editor.setTheme("myCustomTheme");
    });
  }, []);

  return (
    <div>
      <div className="border-[10px] border-gray-800 p-4 bg-gray-950">
        <Editor
          height="60vh"
          width="45vw"
          defaultLanguage={value}
          defaultValue="// Write your code here"
          theme="myCustomTheme"
          onMount={handleEditorDidMount}
        />
      </div>
      <div className="flex justify-end">
        <div className="flex gap-4">
          {/* <Button onClick={runCode} className="mt-4 bg-gray-950">
            Check Errors
          </Button> */}
          <Button onClick={extractCode} className="mt-4 bg-gray-950">
            Save
          </Button>
        </div>
      </div>
      <div
        className={`bg-gray-200 text-red-600 rounded-lg mt-2 ${
          output ? "p-2" : ""
        }`}
      >
        {output}
      </div>
    </div>
  );
};

export default CodeEditor;