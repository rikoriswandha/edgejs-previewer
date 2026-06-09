import { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTab, TabsPanel } from "@/components/ui/tabs";
import { useEdgeCompiler } from "@/hooks/use-edge-compiler";
import { TemplateEditor } from "@/components/template-editor";
import { StateEditor } from "@/components/state-editor";
import { OutputPanel } from "@/components/output-panel";

const DEFAULT_TEMPLATE = `<h1>Hello {{ username || 'Guest' }}!</h1>

@if(users.length)
  <ul>
    @each(user in users)
      <li>{{ user.name }} — {{ user.role }}</li>
    @endeach
  </ul>
@else
  <p>No users found.</p>
@endif`;

const DEFAULT_STATE = `{
  "username": "Virk",
  "users": [
    { "name": "Alice", "role": "admin" },
    { "name": "Bob", "role": "editor" }
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
  const { compile, output, error, isCompiling } = useEdgeCompiler();

  const handleCompile = useCallback(() => {
    let state: Record<string, unknown> = {};
    try {
      state = JSON.parse(stateText) as Record<string, unknown>;
    } catch {
      // Invalid JSON — skip compilation; StateEditor already reports validity
      return;
    }
    void compile(template, state);
  }, [compile, template, stateText]);

  const debouncedCompile = useDebouncedCallback(handleCompile, 500);

  useEffect(() => {
    if (stateValid) {
      debouncedCompile();
    }
  }, [template, stateText, stateValid, debouncedCompile]);

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex items-center justify-between border-b px-4 py-3">
        <h1 className="font-semibold text-lg">Edge.js Previewer</h1>
        <Button
          onClick={handleCompile}
          disabled={isCompiling || !stateValid}
          size="sm"
        >
          <Play className="size-4" />
          Run
        </Button>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <div className="flex w-1/2 flex-col overflow-hidden">
          <Tabs defaultValue="template" className="flex flex-1 flex-col">
            <TabsList className="mx-4 mt-3 w-auto">
              <TabsTab value="template">Template</TabsTab>
              <TabsTab value="state">State</TabsTab>
            </TabsList>
            <TabsPanel value="template" className="flex-1 overflow-hidden p-4">
              <div className="h-full overflow-hidden rounded-lg border">
                <TemplateEditor value={template} onChange={setTemplate} />
              </div>
            </TabsPanel>
            <TabsPanel value="state" className="flex-1 overflow-hidden p-4">
              <div className="h-full overflow-hidden rounded-lg border">
                <StateEditor
                  value={stateText}
                  onChange={(text, valid) => {
                    setStateText(text);
                    setStateValid(valid);
                  }}
                />
              </div>
            </TabsPanel>
          </Tabs>
        </div>
        <Separator orientation="vertical" />
        <div className="w-1/2 overflow-hidden">
          <OutputPanel output={output} error={error} isCompiling={isCompiling} />
        </div>
      </div>
    </div>
  );
}
