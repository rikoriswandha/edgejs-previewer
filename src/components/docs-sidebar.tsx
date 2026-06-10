import { useState, useCallback } from "react";
import { BookOpen, X, PanelRightOpen, PanelRightClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EDGE_DOCS_URL = "https://edgejs.dev/docs/introduction";

export function DocsSidebarTrigger({
  onClick,
  isOpen,
}: {
  onClick: () => void;
  isOpen: boolean;
}) {
  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={onClick}
      title={isOpen ? "Close documentation" : "Open Edge.js documentation"}
    >
      {isOpen ? (
        <PanelRightClose className="size-4" />
      ) : (
        <PanelRightOpen className="size-4" />
      )}
    </Button>
  );
}

export function DocsSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const toggle = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <>
      <DocsSidebarTrigger onClick={toggle} isOpen={isOpen} />

      {/* Overlay backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/30 transition-opacity duration-300",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={close}
        aria-hidden={!isOpen}
      />

      {/* Sidebar panel */}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 flex h-full flex-col border-l bg-background shadow-2xl transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "translate-x-full",
          "w-full sm:w-[600px] lg:w-[720px]"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Edge.js documentation"
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2.5">
            <BookOpen className="size-4 text-primary" />
            <h2 className="text-sm font-semibold">Edge.js Documentation</h2>
            <a
              href={EDGE_DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground text-xs underline underline-offset-2 transition-colors"
            >
              Open in new tab
            </a>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={close}
            title="Close documentation"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Iframe container */}
        <div className="relative flex-1 overflow-hidden bg-muted/30">
          {!isLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground">
              <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-xs">Loading documentation…</span>
            </div>
          )}
          <iframe
            src={EDGE_DOCS_URL}
            title="Edge.js Documentation"
            className={cn(
              "h-full w-full border-0",
              !isLoaded && "opacity-0"
            )}
            onLoad={() => setIsLoaded(true)}
            allow="clipboard-write"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>
    </>
  );
}
