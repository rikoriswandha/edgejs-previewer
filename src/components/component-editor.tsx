import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useCallback } from "react";
import { X } from "lucide-react";
import { useMonacoTheme } from "@/hooks/use-monaco-theme";
import { Button } from "@/components/ui/button";

interface ComponentEditorProps {
  path: string;
  onPathChange: (path: string) => void;
  source: string;
  onSourceChange: (source: string) => void;
  onRemove: () => void;
  isDark: boolean;
}

export function ComponentEditor({
  path,
  onPathChange,
  source,
  onSourceChange,
  onRemove,
  isDark,
}: ComponentEditorProps) {
  const { applyTheme } = useMonacoTheme();

  const handleChange = (newValue: string | undefined) => {
    onSourceChange(newValue ?? "");
  };

  const handleMount = useCallback(
    (monacoEditor: editor.IStandaloneCodeEditor) => {
      monacoEditor.updateOptions({
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        fontSize: 13,
        lineNumbers: "on",
        folding: true,
        wordWrap: "on",
        padding: { top: 8, bottom: 8 },
        renderLineHighlight: "line",
        scrollbar: {
          useShadows: false,
          verticalScrollbarSize: 6,
          horizontalScrollbarSize: 6,
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
    <div className="flex flex-col overflow-hidden rounded-lg border bg-code">
      <div className="flex items-center gap-2 border-b px-3 py-1.5">
        <span className="text-muted-foreground text-xs font-medium">Path</span>
        <input
          type="text"
          value={path}
          onChange={(e) => onPathChange(e.target.value)}
          className="flex-1 rounded border bg-transparent px-2 py-0.5 font-mono text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
          placeholder="components/button"
        />
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onRemove}
          title="Remove component"
          className="size-6"
        >
          <X className="size-3.5" />
        </Button>
      </div>
      <div className="h-[150px] overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="html"
          value={source}
          onChange={handleChange}
          onMount={handleMount}
          theme={isDark ? "edge-warm-dark" : "edge-warm-light"}
          options={{ automaticLayout: true }}
        />
      </div>
    </div>
  );
}
