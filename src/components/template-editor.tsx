import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useCallback } from "react";
import { useMonacoTheme } from "@/hooks/use-monaco-theme";

interface TemplateEditorProps {
  value: string;
  onChange: (value: string) => void;
  isDark: boolean;
}

export function TemplateEditor({ value, onChange, isDark }: TemplateEditorProps) {
  const { applyTheme } = useMonacoTheme();

  const handleChange = (newValue: string | undefined) => {
    onChange(newValue ?? "");
  };

  const handleMount = useCallback(
    (monacoEditor: editor.IStandaloneCodeEditor) => {
      monacoEditor.updateOptions({
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 14,
        lineNumbers: "on",
        folding: true,
        wordWrap: "on",
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: "line",
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 8,
          horizontalScrollbarSize: 8,
        },
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        automaticLayout: true,
      });

      applyTheme(monacoEditor, isDark);
    },
    [applyTheme, isDark],
  );

  return (
    <Editor
      height="100%"
      defaultLanguage="html"
      value={value}
      onChange={handleChange}
      onMount={handleMount}
      theme={isDark ? "edge-warm-dark" : "edge-warm-light"}
      options={{ automaticLayout: true }}
    />
  );
}
