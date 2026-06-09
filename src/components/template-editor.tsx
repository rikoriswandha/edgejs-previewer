import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";

interface TemplateEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TemplateEditor({ value, onChange }: TemplateEditorProps) {
  const handleChange = (newValue: string | undefined) => {
    onChange(newValue ?? "");
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
      defaultLanguage="html"
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
