import { useCallback, useState } from "react";
interface UseEdgeCompilerReturn {
  compile: (template: string, state: Record<string, unknown>, components?: Record<string, string>) => Promise<void>;
  output: string | null;
  error: string | null;
  isCompiling: boolean;
}

export function useEdgeCompiler(): UseEdgeCompilerReturn {
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCompiling, setIsCompiling] = useState(false);

  const compile = useCallback(
    async (template: string, state: Record<string, unknown>, components?: Record<string, string>) => {
      setIsCompiling(true);
      setError(null);

      try {
        const { compileEdge } = await import("@/lib/nodepod-compiler");
        const result = await compileEdge(template, state, components);

        if (result.error) {
          setError(result.error);
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
