import { lazy, Suspense, useCallback } from "react";
import type { editor } from "monaco-editor";
const Editor = lazy(() => import("@monaco-editor/react"));
import { Check, X } from "lucide-react";
import { useMonacoTheme } from "@/hooks/use-monaco-theme";
import { cn } from "@/lib/utils";

interface StateEditorProps {
  value: string;
  onChange: (value: string, isValid: boolean) => void;
  isDark: boolean;
}

export function StateEditor({ value, onChange, isDark }: StateEditorProps) {
  const { applyTheme } = useMonacoTheme();

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

  const isValid = (() => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  })();

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
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-end border-b px-3 py-1.5">
        <div
          className={cn(
            "flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-colors",
            isValid
              ? "bg-success/10 text-success"
              : "bg-destructive/10 text-destructive",
          )}
        >
          {isValid ? (
            <>
              <Check className="size-3" />
              Valid JSON
            </>
          ) : (
            <>
              <X className="size-3" />
              Invalid JSON
            </>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<div className="h-full animate-pulse rounded bg-muted" />}>
          <Editor
            height="100%"
            defaultLanguage="json"
            value={value}
            onChange={handleChange}
            onMount={handleMount}
            theme={isDark ? "edge-warm-dark" : "edge-warm-light"}
            options={{ automaticLayout: true }}
          />
        </Suspense>
      </div>
    </div>
  );
}
