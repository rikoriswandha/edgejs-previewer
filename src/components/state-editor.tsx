import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";

interface StateEditorProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
}

export function StateEditor({ value, onChange }: StateEditorProps) {
  const handleChange = (newValue: string | undefined) => {
    const text = newValue ?? "";
    let isValid = true;
    try {
      JSON.parse(text);
    } catch {
      isValid = false;
    }
    onChange(text, isValid);
  };

  const handleMount = (monacoEditor: editor.IStandaloneCodeEditor) => {
    monacoEditor.updateOptions({
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontSize: 14,
      lineNumbers: "on",
      folding: true,
      wordWrap: "on",
    });
  };

  return (
    <Editor
      height="100%"
      defaultLanguage="json"
      value={value}
      onChange={handleChange}
      onMount={handleMount}
      theme="vs-dark"
      options={{
        automaticLayout: true,
      }}
    />
  );
}
