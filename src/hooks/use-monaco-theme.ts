import { useCallback } from "react";
import type { editor } from "monaco-editor";
import type * as monacoEditor from "monaco-editor";

export type MonacoTheme = "edge-warm-light" | "edge-warm-dark";

function defineWarmLightTheme(monaco: typeof monacoEditor) {
  monaco.editor.defineTheme("edge-warm-light", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "comment", foreground: "9A9086", fontStyle: "italic" },
      { token: "keyword", foreground: "C94F32" },
      { token: "string", foreground: "3D8B40" },
      { token: "number", foreground: "2E7D9E" },
      { token: "tag", foreground: "C94F32" },
      { token: "attribute.name", foreground: "B07D4A" },
      { token: "attribute.value", foreground: "3D8B40" },
      { token: "delimiter.html", foreground: "8A7F76" },
      { token: "delimiter.handlebars", foreground: "E85D3E" },
      { token: "variable.parameter.handlebars", foreground: "2E7D9E" },
    ],
    colors: {
      "editor.background": "#FDFCFA",
      "editor.foreground": "#2A2522",
      "editor.lineHighlightBackground": "#F5F0EB",
      "editor.selectionBackground": "#E85D3E30",
      "editor.inactiveSelectionBackground": "#E85D3E15",
      "editorCursor.foreground": "#E85D3E",
      "editorWhitespace.foreground": "#D9D3CB",
      "editorLineNumber.foreground": "#B0A89E",
      "editorLineNumber.activeForeground": "#8A7F76",
      "editorIndentGuide.background": "#E8E2DA",
      "editorIndentGuide.activeBackground": "#D9D3CB",
    },
  });
}

function defineWarmDarkTheme(monaco: typeof monacoEditor) {
  monaco.editor.defineTheme("edge-warm-dark", {
    base: "vs-dark",
    inherit: true,
    rules: [
      { token: "comment", foreground: "7A7168", fontStyle: "italic" },
      { token: "keyword", foreground: "F08060" },
      { token: "string", foreground: "7EBE80" },
      { token: "number", foreground: "5EB3D4" },
      { token: "tag", foreground: "F08060" },
      { token: "attribute.name", foreground: "C49A6C" },
      { token: "attribute.value", foreground: "7EBE80" },
      { token: "delimiter.html", foreground: "7A7168" },
      { token: "delimiter.handlebars", foreground: "F08060" },
      { token: "variable.parameter.handlebars", foreground: "5EB3D4" },
    ],
    colors: {
      "editor.background": "#1C1917",
      "editor.foreground": "#F2EDE8",
      "editor.lineHighlightBackground": "#2D2926",
      "editor.selectionBackground": "#E85D3E40",
      "editor.inactiveSelectionBackground": "#E85D3E20",
      "editorCursor.foreground": "#F08060",
      "editorWhitespace.foreground": "#3D3530",
      "editorLineNumber.foreground": "#5A524A",
      "editorLineNumber.activeForeground": "#9A9086",
      "editorIndentGuide.background": "#3D3530",
      "editorIndentGuide.activeBackground": "#5A524A",
    },
  });
}

let themesInitialized = false;

async function ensureThemes(): Promise<typeof monacoEditor> {
  // Dynamic import: Monaco is a heavy browser-only library that must be
  // loaded on demand to avoid bloating the initial bundle.
  const { loader } = await import("@monaco-editor/react");
  const monaco = await loader.init();
  if (!themesInitialized) {
    defineWarmLightTheme(monaco);
    defineWarmDarkTheme(monaco);
    themesInitialized = true;
  }
  return monaco;
}

export function useMonacoTheme() {
  const applyTheme = useCallback(
    async (monacoEditor: editor.IStandaloneCodeEditor, isDark: boolean) => {
      const monaco = await ensureThemes();
      const themeName: MonacoTheme = isDark ? "edge-warm-dark" : "edge-warm-light";
      monaco.editor.setTheme(themeName);
      monacoEditor.updateOptions({ theme: themeName });
    },
    [],
  );
  return { applyTheme };
}
