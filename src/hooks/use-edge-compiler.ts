import { useCallback, useState } from "react";

interface CompileResult {
  output: string | null;
  error: string | null;
}

interface UseEdgeCompilerReturn {
  compile: (template: string, state: Record<string, unknown>) => Promise<void>;
  output: string | null;
  error: string | null;
  isCompiling: boolean;
}

export function useEdgeCompiler(): UseEdgeCompilerReturn {
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  const compile = useCallback(
    async (template: string, state: Record<string, unknown>) => {
      setIsCompiling(true);
      setError(null);

      try {
        const response = await fetch("/api/compile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ template, state }),
        });

        const result = (await response.json()) as CompileResult;

        if (!response.ok || result.error) {
          setError(result.error ?? "Unknown compilation error");
          setOutput(null);
        } else {
          setOutput(result.output ?? "");
          setError(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setOutput(null);
      } finally {
        setIsCompiling(false);
      }
    },
    [],
  );

  return { compile, output, error, isCompiling };
}
