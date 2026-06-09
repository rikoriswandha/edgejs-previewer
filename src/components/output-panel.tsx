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
      padding: 1rem;
      color: #171717;
      background: #ffffff;
      line-height: 1.5;
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
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <span className="font-medium text-sm">Output</span>
        {isCompiling && (
          <span className="text-muted-foreground text-sm">Compiling…</span>
        )}
      </div>
      <div className="flex-1 overflow-hidden bg-white">
        {error ? (
          <div className="h-full overflow-auto p-4">
            <pre className="whitespace-pre-wrap text-red-500 text-sm">{error}</pre>
          </div>
        ) : output ? (
          <iframe
            className="h-full w-full border-0"
            sandbox="allow-scripts"
            srcDoc={wrapOutput(output)}
            title="Edge output preview"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-4">
            <p className="text-muted-foreground text-sm">
              Enter a template and state, then click Run to see the output.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
