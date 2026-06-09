import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

interface StatusBarProps {
  status: "idle" | "compiling" | "success" | "error";
  errorMessage: string | null;
}

export function StatusBar({ status, errorMessage }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between border-t bg-muted/50 px-4 py-1.5 text-xs">
      <div className="flex items-center gap-2">
        {status === "compiling" && (
          <>
            <Loader2 className="size-3.5 animate-spin text-primary" />
            <span className="text-muted-foreground">Compiling…</span>
          </>
        )}
        {status === "success" && (
          <>
            <CheckCircle className="size-3.5 text-success" />
            <span className="text-success-foreground">Compiled successfully</span>
          </>
        )}
        {status === "error" && (
          <>
            <AlertCircle className="size-3.5 text-destructive" />
            <span className="text-destructive">{errorMessage || "Compilation failed"}</span>
          </>
        )}
        {status === "idle" && (
          <span className="text-muted-foreground">Ready</span>
        )}
      </div>
      <div className="text-muted-foreground">
        Edge.js v6
      </div>
    </div>
  );
}
