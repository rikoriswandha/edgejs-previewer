import { useCallback, useEffect, useRef, useState } from "react";
import pkg from "../../package.json";
import { Play, Moon, Sun, Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEdgeCompiler } from "@/hooks/use-edge-compiler";
import { TemplateEditor } from "@/components/template-editor";
import { StateEditor } from "@/components/state-editor";
import { OutputPanel } from "@/components/output-panel";
import { PresetSelector } from "@/components/preset-selector";
import { type Preset } from "@/components/preset-data";
import { StatusBar } from "@/components/status-bar";
import { ComponentEditor } from "@/components/component-editor";
import { DocsSidebar } from "@/components/docs-sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

const DEFAULT_TEMPLATE = `<h1 class="text-3xl font-bold text-orange-600">Hello {{ username || 'Guest' }}! 👋</h1>
<p class="mt-2 text-gray-600">Welcome to Edge.js — the templating engine for AdonisJS.</p>

<div class="mt-6 space-y-2">
  @if(users.length)
    <h2 class="text-lg font-semibold">Team Members</h2>
    @each(user in users)
      <div class="flex items-center gap-3 p-2 bg-gray-50 rounded">
        <div class="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-sm font-bold">
          {{ user.name[0] }}
        </div>
        <div>
          <p class="font-medium">{{ user.name }}</p>
          <p class="text-sm text-gray-500">{{ user.role }}</p>
        </div>
      </div>
    @endeach
  @else
    <p class="text-gray-500 italic">No users found.</p>
  @endif
</div>`;

const DEFAULT_STATE = `{
  "username": "Virk",
  "users": [
    { "name": "Alice", "role": "admin" },
    { "name": "Bob", "role": "editor" },
    { "name": "Carol", "role": "viewer" }
  ]
}`;

function useDebouncedCallback<T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number,
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  return useCallback(
    (...args: Parameters<T>) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );
}
export function EdgePreviewer() {
  const [template, setTemplate] = useState(DEFAULT_TEMPLATE);
  const [stateText, setStateText] = useState(DEFAULT_STATE);
  const [stateValid, setStateValid] = useState(true);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isDark, setIsDark] = useState(false);
  const [autoCompile, setAutoCompile] = useState(true);
  const { compile, output, error, isCompiling } = useEdgeCompiler();
  const compileStatus: "idle" | "compiling" | "success" | "error" = isCompiling
    ? "compiling"
    : error
      ? "error"
      : output
        ? "success"
        : "idle";
  const [components, setComponents] = useState<{ path: string; source: string }[]>([]);
  const handleCompile = useCallback(() => {
    let state: Record<string, unknown> = {};
    try {
      state = JSON.parse(stateText) as Record<string, unknown>;
    } catch {
      return;
    }
    const componentsMap = Object.fromEntries(
      components.filter((c) => c.source.trim()).map((c) => [c.path, c.source]),
    );
    void compile(template, state, componentsMap);
  }, [compile, template, stateText, components]);

  const debouncedCompile = useDebouncedCallback(handleCompile, 400);

  const componentsKey = JSON.stringify(components);
  useEffect(() => {
    if (autoCompile && stateValid) {
      debouncedCompile();
    }
  }, [template, stateText, stateValid, autoCompile, debouncedCompile, componentsKey]);

  // Keyboard shortcut: Cmd/Ctrl + Enter to compile
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleCompile();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCompile]);

  const handlePresetSelect = useCallback((preset: Preset) => {
    setActivePreset(preset.id);
    setTemplate(preset.template.trim());
    setStateText(preset.state);
    setStateValid(true);
    setComponents(preset.components ?? []);
  }, []);
  const addComponent = useCallback(() => {
    setComponents((prev) => [
      ...prev,
      { path: `components/${prev.length + 1}`, source: "" },
    ]);
  }, []);
  const removeComponent = useCallback((index: number) => {
    setComponents((prev) => prev.filter((_, i) => i !== index));
  }, []);
  const updateComponentPath = useCallback((index: number, path: string) => {
    setComponents((prev) =>
      prev.map((c, i) => (i === index ? { ...c, path } : c)),
    );
  }, []);
  const updateComponentSource = useCallback((index: number, source: string) => {
    setComponents((prev) =>
      prev.map((c, i) => (i === index ? { ...c, source } : c)),
    );
  }, []);
  const toggleTheme = useCallback(() => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  }, []);
  const isTooSmall = useMediaQuery("max-md");
  return (
    <div className={cn("flex h-screen flex-col overflow-hidden", isDark && "dark")}>
      {isTooSmall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-6">
          <div className="max-w-sm text-center">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <span className="text-lg">📱</span>
            </div>
            <h2 className="mb-2 text-lg font-semibold">Screen too small</h2>
            <p className="text-sm text-muted-foreground">
              Edge.js Previewer works best on larger screens. Please switch to a desktop or tablet in landscape mode.
            </p>
          </div>
        </div>
      )}
      {/* Header */}
      <header className="flex items-center justify-between border-b bg-card px-4 py-2.5">
        <div className="flex items-center gap-3">
          <img src="/favicon.svg" alt="Edge.js Previewer" className="size-8 rounded-lg" />
          <div>
            <h1 className="text-sm font-semibold leading-tight">Edge.js Previewer</h1>
            <p className="text-muted-foreground text-xs">Learn Edge templating interactively</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Auto-compile toggle */}
          <button
            onClick={() => setAutoCompile((prev) => !prev)}
            className={cn(
              "flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition-colors",
              autoCompile
                ? "bg-primary/10 text-primary"
                : "bg-muted text-muted-foreground hover:bg-muted/80",
            )}
            title={autoCompile ? "Auto-compile is on" : "Auto-compile is off"}
          >
            <Zap className={cn("size-3", autoCompile && "fill-current")} />
            Auto
          </button>
          {/* Docs sidebar */}
          <DocsSidebar />

          {/* GitHub link */}
          <a
            href={pkg.repository.url.replace(/^git\+/, "").replace(/\.git$/, "")}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground size-8"
            title="View on GitHub"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-4"
              aria-hidden="true"
            >
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
          </a>

          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={toggleTheme}
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>

          {/* Run button */}
          <Button
            onClick={handleCompile}
            disabled={isCompiling || !stateValid}
            size="sm"
            className="gap-1.5"
          >
            <Play className="size-3.5 fill-current" />
            Run
            <span className="text-primary-foreground/60 hidden text-xs sm:inline">
              ⌘↵
            </span>
          </Button>
        </div>
      </header>

      {/* Preset selector */}
      <PresetSelector activePreset={activePreset} onSelect={handlePresetSelect} />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Editors */}
        <div className="flex w-1/2 flex-col overflow-hidden">
          {/* Template editor */}
          <div className="flex flex-[2] flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-3 pb-1">
              <span className="text-muted-foreground text-xs font-medium">Template</span>
            </div>
            <div className="mx-4 mb-2 flex-1 overflow-hidden rounded-xl border bg-code">
              <TemplateEditor value={template} onChange={setTemplate} isDark={isDark} />
            </div>
          </div>

          <Separator />

          {/* State editor */}
          <div className="flex flex-1 flex-col overflow-hidden">
            <div className="flex items-center justify-between px-4 pt-2 pb-1">
              <span className="text-muted-foreground text-xs font-medium">State (JSON)</span>
            </div>
            <div className="mx-4 mb-3 flex-1 overflow-hidden rounded-xl border bg-code">
              <StateEditor
                value={stateText}
                onChange={(text, valid) => {
                  setStateText(text);
                  setStateValid(valid);
                }}
                isDark={isDark}
              />
            </div>
          </div>
          <Separator />
          {/* Components section */}
          <div className="flex flex-col overflow-auto">
            <div className="flex items-center justify-between px-4 pt-2 pb-1">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground text-xs font-medium">Components</span>
                <span className="text-muted-foreground/60 hidden text-[10px] sm:inline">
                  Use @component("path") or @!component("path")
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={addComponent}
                className="h-6 gap-1 text-xs"
              >
                <Plus className="size-3" />
                Add
              </Button>
            </div>
            <div className="mx-4 mb-3 space-y-2">
              {components.map((component, index) => (
                <ComponentEditor
                  key={index}
                  path={component.path}
                  onPathChange={(path) => updateComponentPath(index, path)}
                  source={component.source}
                  onSourceChange={(source) => updateComponentSource(index, source)}
                  onRemove={() => removeComponent(index)}
                  isDark={isDark}
                />
              ))}
            </div>
          </div>
        </div>

        <Separator orientation="vertical" />

        {/* Right: Preview */}
        <div className="w-1/2 overflow-hidden">
          <OutputPanel output={output} error={error} isCompiling={isCompiling} />
        </div>
      </div>

      {/* Status bar */}
      <StatusBar status={compileStatus} errorMessage={error} />
    </div>
  );
}
