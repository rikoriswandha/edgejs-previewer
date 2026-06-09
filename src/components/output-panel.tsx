import { AlertTriangle, Eye, RefreshCw } from "lucide-react";

function wrapOutput(html: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      padding: 1.5rem;
      color: #2a2522;
      background: #ffffff;
      line-height: 1.6;
    }
  </style>
</head>
<body>
${html}
</body>
</html>`;
}

interface OutputPanelProps {
  output: string | null;
  error: string | null;
  isCompiling: boolean;
}

export function OutputPanel({ output, error, isCompiling }: OutputPanelProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Eye className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium">Live Preview</span>
        </div>
        {isCompiling && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <RefreshCw className="size-3.5 animate-spin" />
            <span className="text-xs">Updating…</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="relative flex-1 overflow-hidden">
        {error ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
            <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="size-6 text-destructive" />
            </div>
            <div className="max-w-md text-center">
              <p className="text-sm font-medium text-destructive">
                Template Error
              </p>
              <pre className="mt-2 whitespace-pre-wrap rounded-lg bg-destructive/5 p-4 text-left text-xs leading-relaxed text-destructive/90">
                {error}
              </pre>
            </div>
            <p className="text-muted-foreground text-xs">
              Check your template syntax and try again.
            </p>
          </div>
        ) : output ? (
          <iframe
            className="h-full w-full border-0"
            sandbox="allow-scripts"
            srcDoc={wrapOutput(output)}
            title="Edge output preview"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
              <Eye className="size-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Nothing to preview yet</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Write a template and add some state to see it come alive.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
