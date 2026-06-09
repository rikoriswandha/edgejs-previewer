import { Frame, FramePanel } from "@/components/ui/frame";

interface OutputPanelProps {
  output: string | null;
  error: string | null;
  isCompiling: boolean;
}

export function OutputPanel({ output, error, isCompiling }: OutputPanelProps) {
  return (
    <Frame className="h-full rounded-none bg-transparent p-0">
      <FramePanel className="flex h-full flex-col overflow-hidden rounded-none border-0 p-0">
        <div className="flex items-center justify-between border-b px-4 py-2">
          <span className="font-medium text-sm">Output</span>
          {isCompiling && (
            <span className="text-muted-foreground text-sm">Compiling…</span>
          )}
        </div>
        <div className="flex-1 overflow-auto p-4">
          {error ? (
            <pre className="whitespace-pre-wrap text-red-500 text-sm">{error}</pre>
          ) : output ? (
            <iframe
              className="h-full w-full border-0"
              sandbox=""
              srcDoc={output}
              title="Edge output preview"
            />
          ) : (
            <p className="text-muted-foreground text-sm">
              Enter a template and state, then click Run to see the output.
            </p>
          )}
        </div>
      </FramePanel>
    </Frame>
  );
}
