import type { Nodepod } from "@scelar/nodepod";

interface CompileResult {
  output: string | null;
  error: string | null;
}

const COMPILE_SCRIPT = `
const { Edge } = require('edge.js');
const fs = require('fs');

async function main() {
  const edge = new Edge({ cache: false });

  const template = fs.readFileSync('/tmp/template.edge', 'utf8');
  edge.registerTemplate('preview', { template });

  const componentsRaw = fs.readFileSync('/tmp/components.json', 'utf8');
  const components = JSON.parse(componentsRaw);
  for (const [key, value] of Object.entries(components)) {
    edge.registerTemplate(key, { template: value });
  }

  const stateRaw = fs.readFileSync('/tmp/state.json', 'utf8');
  const state = JSON.parse(stateRaw);

  const output = await edge.render('preview', state);
  console.log(JSON.stringify({ output }));
}

main().catch(err => {
  console.error(JSON.stringify({ error: err.message }));
  process.exit(1);
});
`;

let nodepod: Nodepod | null = null;
let initPromise: Promise<Nodepod> | null = null;

async function getNodepod(): Promise<Nodepod> {
  if (nodepod) return nodepod;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const { Nodepod } = await import("@scelar/nodepod");
    const instance = await Nodepod.boot();
    nodepod = instance;

    await instance.fs.writeFile("/tmp/compile.js", COMPILE_SCRIPT);
    await instance.packages.install("edge.js");

    return instance;
  })();

  return initPromise;
}

export async function compileEdge(
  template: string,
  state: Record<string, unknown>,
  components?: Record<string, string>,
): Promise<CompileResult> {
  const instance = await getNodepod();

  await Promise.all([
    instance.fs.writeFile("/tmp/template.edge", template),
    instance.fs.writeFile("/tmp/state.json", JSON.stringify(state)),
    instance.fs.writeFile("/tmp/components.json", JSON.stringify(components ?? {})),
  ]);

  const proc = await instance.spawn("node", ["/tmp/compile.js"]);

  let stdout = "";
  let stderr = "";

  proc.on("output", (text) => {
    stdout += text;
  });
  proc.on("error", (text) => {
    stderr += text;
  });

  await proc.completion;

  if (stderr) {
    try {
      const result = JSON.parse(stderr.trim()) as CompileResult;
      return { output: null, error: result.error ?? stderr.trim() };
    } catch {
      return { output: null, error: stderr.trim() || "Compilation error" };
    }
  }

  if (!stdout.trim()) {
    return { output: null, error: "No output from compiler" };
  }

  const result = JSON.parse(stdout.trim()) as CompileResult;
  return result;
}
