export interface Preset {
  id: string;
  label: string;
  template: string;
  state: string;
  components?: { path: string; source: string }[];
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
  {
    id: "bootstrap",
    label: "Bootstrap",
    template: `<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>

<div class="container py-4">
  <div class="alert alert-primary" role="alert">
    Hello, <strong>{{ user.name }}</strong>! This is Bootstrap 5 loaded via inline CDN.
  </div>

  <div class="card">
    <div class="card-header">Team Members</div>
    <ul class="list-group list-group-flush">
      @each(member in team)
        <li class="list-group-item d-flex justify-content-between align-items-center">
          {{ member.name }}
          <span class="badge bg-{{ member.status === 'active' ? 'success' : 'secondary' }} rounded-pill">
            {{ member.status }}
          </span>
        </li>
      @endeach
    </ul>
  </div>

  <button type="button" class="btn btn-outline-primary mt-3" onclick="alert('Hello from inline script!')">
    Click me
  </button>
</div>`,
    state: JSON.stringify(
      {
        user: { name: "Edge Developer" },
        team: [
          { name: "Alice", status: "active" },
          { name: "Bob", status: "away" },
          { name: "Carol", status: "active" },
        ],
      },
      null,
      2,
    ),
  },
  {
    id: "bulma",
    label: "Bulma",
    template: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.2/css/bulma.min.css" />

<section class="section">
  <div class="container">
    <h1 class="title is-3 has-text-primary">Hello, {{ user.name }}! 🎉</h1>
    <p class="subtitle is-5">This template uses Bulma CSS via inline link tag.</p>

    <div class="box">
      <h2 class="title is-5">Tasks</h2>
      @each(task in tasks)
        <div class="notification is-{{ task.done ? 'success' : 'warning' }} is-light">
          <label class="checkbox">
            <input type="checkbox" {{ task.done ? 'checked' : '' }} disabled />
            <strong>{{ task.title }}</strong>
          </label>
        </div>
      @endeach
    </div>
  </div>
</section>`,
    state: JSON.stringify(
      {
        user: { name: "Bulma Fan" },
        tasks: [
          { title: "Set up Bulma CDN", done: true },
          { title: "Write Edge template", done: true },
          { title: "Deploy to production", done: false },
        ],
      },
      null,
      2,
    ),
  },
  {
    id: "picocss",
    label: "Pico CSS",
    template: `<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css" />

<main class="container">
  <h1>Welcome, {{ name }}!</h1>
  <p>Pico is a classless CSS framework. Just write semantic HTML — no classes needed.</p>

  <article>
    <header>User Preferences</header>
    <form>
      <label>
        Username
        <input type="text" value="{{ name }}" placeholder="Enter your name" />
      </label>
      <label>
        Theme
        <select>
          @each(option in themes)
            <option {{ option === theme ? 'selected' : '' }}>{{ option }}</option>
          @endeach
        </select>
      </label>
      <label>
        <input type="checkbox" {{ newsletter ? 'checked' : '' }} />
        Subscribe to newsletter
      </label>
    </form>
  </article>

  <details>
    <summary>Debug Info</summary>
    <pre><code>{{ JSON.stringify({ name, theme, newsletter }) }}</code></pre>
  </details>
</main>`,
    state: JSON.stringify(
      {
        name: "Edge Explorer",
        theme: "dark",
        themes: ["light", "dark", "auto"],
        newsletter: true,
      },
      null,
      2,
    ),
  },
  {
    id: "vanilla-js",
    label: "Inline JS",
    template: `<div class="max-w-md mx-auto p-6 space-y-4">
  <h1 class="text-2xl font-bold text-orange-600">Counter: <span id="count">{{ count }}</span></h1>

  <div class="flex gap-2">
    <button id="dec" class="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">−</button>
    <button id="inc" class="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600">+</button>
    <button id="reset" class="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200">Reset</button>
  </div>

  <p class="text-sm text-gray-500">
    This example shows a vanilla inline script running inside the preview iframe.
    The script reads the initial count from the rendered DOM and updates it interactively.
  </p>
</div>

<script>
  (function () {
    var countEl = document.getElementById('count');
    var count = parseInt(countEl.textContent, 10) || 0;

    function update(n) {
      count = n;
      countEl.textContent = count;
      countEl.style.color = count > 0 ? '#16a34a' : count < 0 ? '#dc2626' : '#ea580c';
    }

    document.getElementById('inc').addEventListener('click', function () { update(count + 1); });
    document.getElementById('dec').addEventListener('click', function () { update(count - 1); });
    document.getElementById('reset').addEventListener('click', function () { update(0); });
  })();
  </script>`,
    state: JSON.stringify({ count: 5 }, null, 2),
  },
  {
    id: "components",
    label: "Components",
    template: `<div class="max-w-md space-y-4">
  <h1 class="text-2xl font-bold text-orange-600">Team Directory</h1>
  @each(member in team)
    @!component('components/card', {
      name: member.name,
      role: member.role,
      avatar: member.avatar
    })
  @endeach
</div>`,
    state: JSON.stringify({
      team: [
        { name: "Alice", role: "admin", avatar: "A" },
        { name: "Bob", role: "editor", avatar: "B" },
        { name: "Carol", role: "viewer", avatar: "C" },
      ],
    }, null, 2),
    components: [
      {
        path: "components/card",
        source: `<div class="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-gray-200">
  <div class="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center text-sm font-bold text-orange-700">
    {{ avatar }}
  </div>
  <div>
    <p class="font-semibold text-gray-800">{{ name }}</p>
    <p class="text-sm text-gray-500">{{ role }}</p>
  </div>
</div>`,
      },
    ],
  },
  {
    id: "slots",
    label: "Slots",
    template: `@component('components/modal', { title: 'Delete Post' })
  @slot('header')
    <h2 class="text-lg font-bold text-red-600">⚠ Confirm Deletion</h2>
  @end
  @slot('content')
    <p class="text-gray-600">Are you sure you want to delete this post? This action cannot be undone.</p>
  @end
  @slot('footer')
    <div class="flex gap-2">
      <button class="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
      <button class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
    </div>
  @end
@end`,
    state: JSON.stringify({}, null, 2),
    components: [
      {
        path: "components/modal",
        source: `@let(attributes = $props.merge({ class: ['rounded-lg', 'shadow-lg', 'p-6', 'max-w-md', 'mx-auto'] }).toAttrs())
<div {{ attributes }}>
  <div class="mb-4 border-b pb-2">
    {{{ await $slots.header() }}}
  </div>
  <div class="mb-4">
    {{{ await $slots.content() }}}
  </div>
  <div class="flex justify-end">
    {{{ await $slots.footer() }}}
  </div>
</div>`,
      },
    ],
  },
];
