export function DashboardView() {
  return `
  <div class="flex min-h-screen bg-slate-900 text-slate-200">

    <!-- Sidebar -->
    <aside class="w-64 bg-slate-950 border-r border-slate-800">
      <div class="p-5 space-y-6">
        <h1 class="text-xl font-bold text-blue-400">PreSkool</h1>

        <nav class="space-y-2 text-sm">
          <a href="#/dashboard"
            class="block px-3 py-2 rounded hover:bg-slate-800">
            Dashboard
          </a>

          <a
  href="#/students"
  class="block px-3 py-2 rounded hover:bg-slate-800">
  Students
</a>

        </nav>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col">

      <!-- Topbar -->
      <header class="h-16 bg-slate-900 border-b border-slate-800
                     flex items-center justify-between px-6">
        <span class="text-sm text-slate-400">
          Academic Year: 2024–2025
        </span>

        <button id="logoutBtn"
          class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-sm">
          Logout
        </button>
      </header>

      <!-- DYNAMIC CONTENT -->
      <main id="pageContent" class="p-6">
        <!-- content injected here -->
      </main>

    </div>
  </div>
  `;
}
