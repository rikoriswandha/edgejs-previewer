import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Edge } from "edge.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));

/**
 * POST /api/compile
 * Compiles an Edge.js template with the provided state and optional components.
 */
app.post("/api/compile", async (req, res) => {
  const { template, state, components } = req.body;

  if (typeof template !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'template' field" });
  }

  const edge = new Edge({ cache: false });
  const templateName = "preview";

  try {
    edge.registerTemplate(templateName, { template });

    if (components && typeof components === "object") {
      for (const [key, value] of Object.entries(components)) {
        if (typeof value === "string") {
          edge.registerTemplate(key, { template: value });
        }
      }
    }

    const output = await edge.render(templateName, state ?? {});
    res.json({ output });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

/**
 * Serve static files from the Vite build output.
 */
app.use(express.static(path.join(__dirname, "dist")));

/**
 * SPA fallback: serve index.html for all non-API routes.
 */
app.get(/.*/, (_req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Edge.js Previewer running on http://localhost:${PORT}`);
});
