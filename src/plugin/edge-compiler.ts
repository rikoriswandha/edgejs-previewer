import type { Plugin } from "vite";
import type { IncomingMessage } from "http";
import { Edge } from "edge.js";

interface CompileRequest {
  template: string;
  state: Record<string, unknown>;
  components?: Record<string, string>;
}

function readBody(req: IncomingMessage): Promise<string> {
  const { promise, resolve, reject } = Promise.withResolvers<string>();
  let data = "";
  req.setEncoding("utf8");
  req.on("data", (chunk: string) => {
    data += chunk;
  });
  req.on("end", () => resolve(data));
  req.on("error", reject);
  return promise;
}

export function edgeCompilerPlugin(): Plugin {
  return {
    name: "edge-compiler",
    configureServer(server) {
      server.middlewares.use("/api/compile", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: "Method not allowed" }));
          return;
        }

        const body = await readBody(req);

        let request: CompileRequest;
        try {
          request = JSON.parse(body) as CompileRequest;
        } catch {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: "Invalid JSON body" }));
          return;
        }

        const edge = new Edge({ cache: false });
        const templateName = "preview";

        try {
          edge.registerTemplate(templateName, {
            template: request.template,
          });
          if (request.components) {
            for (const [key, value] of Object.entries(request.components)) {
              edge.registerTemplate(key, { template: value });
            }
          }
          const output = await edge.render(templateName, request.state);
          const response = { output };
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(response));
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          const response = { error: message };
          res.statusCode = 500;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(response));
        }
      });
    },
  };
}
