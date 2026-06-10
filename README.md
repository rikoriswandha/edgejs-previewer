# Edge.js Previewer

A browser-based playground for writing [Edge.js](https://edgejs.dev/) templates and previewing the rendered output with live JSON state. No server setup required for development — just write templates, edit state, and see results instantly.

> **Friendly, approachable, and encouraging.** Built for developers learning AdonisJS templating who want immediate visual feedback.

---

## Features

- **Live template editor** with syntax-highlighted Monaco Editor
- **Real-time JSON state editor** with validation feedback
- **Instant preview** rendered in a sandboxed iframe with Tailwind CSS
- **Built-in examples** — switch between Hello World, Conditionals, Loops, Components, and more
- **Dark & light themes** with warm, accessible color palettes
- **Component authoring** — define and register reusable Edge components inline
- **Helpful error states** — compilation errors are shown inline with guidance
- **Debounced compilation** — performance-optimized updates as you type

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| Build Tool | [Vite](https://vitejs.dev/) |
| Styling | [Tailwind CSS v4](https://tailwindcss.com/) |
| UI Primitives | [@base-ui/react](https://base-ui.com/) + [shadcn/ui](https://ui.shadcn.com/) |
| Editor | [Monaco Editor](https://microsoft.github.io/monaco-editor/) (via `@monaco-editor/react`) |
| Template Engine | [Edge.js](https://edgejs.dev/) |
| Browser Runtime | [@scelar/nodepod](https://github.com/ScelarOrg/NodePod) (in-browser Node.js) |
| Host Runtime | [Node.js](https://nodejs.org/) ≥ 20 / [Bun](https://bun.sh/) ≥ 1.0 |
| Server | [Express](https://expressjs.com/) (production) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) ≥ 20 or [Bun](https://bun.sh/) ≥ 1.0

### Installation

```bash
# Clone the repository
git clone https://github.com/rikoriswandha/edgejs-previewer.git
cd edgejs-previewer

# Install dependencies
bun install

# Start the development server
bun run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Development Notes

Template compilation runs entirely inside the browser via [@scelar/nodepod](https://github.com/ScelarOrg/NodePod), an in-browser Node.js runtime. The compiler lives in `src/lib/nodepod-compiler.ts` and spawns a NodePod process that executes `edge.js` against the template, state, and registered components. No backend server is needed during development.

Because NodePod executes inside a browser environment, certain browser globals (for example `window.name`) leak into the global object. Edge.js's parser treats those globals as resolvable identifiers and skips prefixing them with `state.`, which can shadow component props such as `name`. The compiler script sanitizes these globals before booting Edge.js so props resolve correctly.

---

## Building for Production

```bash
bun run build
```

### Running the Production Server

The included Express server serves the built static files. Template compilation runs entirely client-side via NodePod, so the production server only needs to host the static SPA.

```bash
bun run start
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment

### Docker

Build and run with Docker:

```bash
# Build the image
docker build -t edgejs-previewer .

# Run the container
docker run -p 3000:3000 edgejs-previewer
```

### Node.js Hosting (Railway, Render, Fly.io, etc.)

1. Push your code to a Git repository.
2. Connect the repository to your hosting platform.
3. Set the **build command** to `bun run build`.
4. Set the **start command** to `bun run start` or `node server.js`.
5. Ensure the platform exposes port `3000` (or set `PORT` environment variable).

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port the Express server listens on |

---

## Project Structure

```
.
├── .github/workflows/      # CI/CD workflows
├── src/
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── edge-previewer.tsx    # Main playground layout
│   │   ├── template-editor.tsx   # Edge template Monaco editor
│   │   ├── state-editor.tsx      # JSON state Monaco editor
│   │   ├── output-panel.tsx      # Rendered preview iframe
│   │   ├── preset-selector.tsx   # Example preset buttons
│   │   ├── component-editor.tsx  # Inline component editor
│   │   ├── status-bar.tsx        # Compilation status bar
│   │   └── preset-data.ts        # Built-in example presets
│   ├── hooks/
│   │   ├── use-edge-compiler.ts  # Compile API client
│   │   ├── use-monaco-theme.ts   # Custom warm editor themes
│   │   └── use-media-query.ts    # Responsive breakpoint hook
│   ├── lib/
│   │   ├── nodepod-compiler.ts   # In-browser Edge.js compiler (NodePod)
│   │   └── utils.ts              # cn() class merger
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css                 # Tailwind v4 theme tokens
├── server.js                 # Express production server
├── Dockerfile
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── package.json
└── README.md
```

---

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure your code passes linting and type checking:

```bash
bun run lint
bun run build
```

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

## Acknowledgments

- [Edge.js](https://edgejs.dev/) — the elegant templating engine by the AdonisJS team
- [shadcn/ui](https://ui.shadcn.com/) and [@coss/style](https://github.com/cossssssssss/ui) for the component system
- [Monaco Editor](https://microsoft.github.io/monaco-editor/) for the best-in-class code editing experience
