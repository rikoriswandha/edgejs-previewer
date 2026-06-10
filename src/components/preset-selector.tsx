import { useCallback } from "react";
import { cn } from "@/lib/utils";
import { PRESETS, type Preset } from "./preset-data";

interface PresetSelectorProps {
  activePreset: string | null;
  onSelect: (preset: Preset) => void;
}

export function PresetSelector({ activePreset, onSelect }: PresetSelectorProps) {
  const handleSelect = useCallback(
    (preset: Preset) => {
      onSelect(preset);
    },
    [onSelect],
  );

  return (
    <div className="flex items-center gap-1.5 px-4 py-2">
      <span className="text-muted-foreground text-xs font-medium mr-2">Try an example:</span>
      {PRESETS.map((preset) => (
        <button
          key={preset.id}
          onClick={() => handleSelect(preset)}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium transition-all duration-200",
            "border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
            activePreset === preset.id
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-secondary text-secondary-foreground border-transparent hover:bg-secondary/80 hover:border-border",
          )}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
