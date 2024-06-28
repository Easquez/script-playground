"use client";
import React, { useState, useRef } from "react";
import Editor from "@monaco-editor/react";

function MonacoEditor() {
  const [fileName, setFileName] = useState("script.js");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [isIncrement, setIsIncrement] = useState(false);
  const editorRef = useRef(null);

  const [files, setFiles] = useState({
    "script.js": {
      name: "script.js",
      language: "javascript",
      value: "// Start coding with JavaScript!\nconsole.log('Hello, world!');",
    },
  });
  const file = files[fileName];

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  const addNewFile = () => {
    const newFileName = prompt("Enter new JavaScript's file name:") + ".js";
    const value = prompt("Enter starting code:");
    if (newFileName && !files[newFileName]) {
      setFiles({
        ...files,
        [newFileName]: {
          name: newFileName,
          language: "javascript",
          value: value,
        },
      });
      setFileName(newFileName);
    } else {
      alert("File name is required or file already exists.");
    }
  };

  const handleIncrement = () => {
    setIsIncrement(!isIncrement);
  };

  const executeCode = () => {
    const userCode = editorRef.current.getValue();
    try {
      const originalConsoleLog = console.log;
      let output = "";
      console.log = (...args) => {
        output += args.join(" ") + "\n";

        if (!isIncrement) {
          setConsoleOutput(args.join(" ") + "\n");
        } else {
          setConsoleOutput((prevOutput) => prevOutput + args.join(" ") + "\n");
        }
      };

      new Function(userCode)();

      console.log = originalConsoleLog;
    } catch (err) {
      setConsoleOutput(`Error: ${err}`);
    }
  };

  return (
    <div className="App">
      <div>
        {Object.keys(files).map((fileKey) => (
          <button
            key={fileKey}
            onClick={() => setFileName(fileKey)}
            className="btn btn-outline-dark btn-sm mx-2 my-1"
          >
            {fileKey}
          </button>
        ))}
        <button onClick={addNewFile} className="btn btn-outline-dark btn-sm">
          +
        </button>
        <button
          onClick={executeCode}
          className="btn btn-primary btn-sm mx-5 my-1"
        >
          Run
        </button>
        <button
          onClick={setConsoleOutput.bind(this, "")}
          className="btn btn-dark btn-sm mx-2 my-1"
        >
          Clear
        </button>
        <button
          onClick={handleIncrement}
          className={`btn btn-${
            isIncrement ? "success" : "danger"
          } btn-sm mx-2 my-1`}
        >
          Increment Line Output: {isIncrement ? "On" : "Off"}
        </button>
      </div>
      <Editor
        height="70vh"
        defaultLanguage={file.language}
        defaultValue={file.value}
        theme="vs-dark"
        path={file.name}
        onMount={handleEditorDidMount}
      />
      <div>
        <h3>Console Output:</h3>
        <Editor
          height="20vh"
          theme="vs-dark"
          value={consoleOutput}
          options={{
            readOnly: true,
            lineNumbers: "on",
            contextmenu: false,
            minimap: { enabled: false },
            scrollbar: { vertical: "auto" },
          }}
        />
      </div>
    </div>
  );
}

export default MonacoEditor;
