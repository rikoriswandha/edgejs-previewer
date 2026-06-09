import { useCallback } from "react";
import { cn } from "@/lib/utils";

export interface Preset {
  id: string;
  label: string;
  template: string;
  state: string;
}

export const PRESETS: Preset[] = [
  {
    id: "hello",
    label: "Hello World",
    template: `<h1 class="text-3xl font-bold text-orange-600">Hello {{ username || 'Guest' }}! 👋</h1>
<p class="mt-2 text-gray-600">Welcome to Edge.js.</p>`,
    state: JSON.stringify({ username: "Edge" }, null, 2),
  },
  {
    id: "conditionals",
    label: "Conditionals",
    template: `<div class="p-4 bg-orange-50 rounded-lg">
  @if(isLoggedIn)
    <p>Welcome back, <strong>{{ user.name }}</strong>! 🎉</p>
  @else
    <p>Please <a href="#" class="text-orange-600">sign in</a> to continue.</p>
  @endif
</div>`,
    state: JSON.stringify(
      { isLoggedIn: true, user: { name: "Virk" } },
      null,
      2,
    ),
  },
  {
    id: "loops",
    label: "Loops",
    template: `<div class="space-y-2">
  <h2 class="text-lg font-semibold">Team Members</h2>
  @each(user in users)
    <div class="flex items-center gap-3 p-2 bg-gray-50 rounded">
      <div class="w-8 h-8 bg-orange-200 rounded-full flex items-center justify-center text-sm font-bold">
        {{ user.name[0] }}
      </div>
      <div>
        <p class="font-medium">{{ user.name }}</p>
        <p class="text-sm text-gray-500">{{ user.role }}</p>
      </div>
    </div>
  @endeach
</div>`,
    state: JSON.stringify(
      {
        users: [
          { name: "Alice", role: "admin" },
          { name: "Bob", role: "editor" },
          { name: "Carol", role: "viewer" },
        ],
      },
      null,
      2,
    ),
  },
  {
    id: "expressions",
    label: "Expressions",
    template: `<div class="max-w-md space-y-4">
  <h1 class="text-2xl font-bold text-orange-600">
    Hello, {{ user.name }}! 👋
  </h1>

  <p class="text-gray-600">
    You have {{ tasks.length }} task{{ tasks.length !== 1 ? 's' : '' }} pending.
  </p>

  @if(tasks.length)
    <ul class="space-y-2">
      @each(task in tasks)
        <li class="flex items-center gap-2 p-2 bg-gray-50 rounded">
          @if(task.done)
            <span class="text-green-500">✓</span>
          @else
            <span class="text-gray-300">○</span>
          @endif
          <span class="{{ task.done ? 'line-through text-gray-400' : '' }}">
            {{ task.title }}
          </span>
        </li>
      @endeach
    </ul>
  @else
    <p class="text-gray-500 italic">All caught up! 🎉</p>
  @endif
</div>`,
    state: JSON.stringify(
      {
        user: { name: "Virk" },
        tasks: [
          { title: "Review pull request", done: true },
          { title: "Write Edge.js documentation", done: false },
          { title: "Update dependencies", done: false },
        ],
      },
      null,
      2,
    ),
  },
];

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
