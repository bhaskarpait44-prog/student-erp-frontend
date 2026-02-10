export function DashboardView() {
  return `
  <div class="flex min-h-screen bg-slate-900 text-slate-200">

    <!-- Sidebar -->
    <aside class="w-64 bg-slate-950 border-r border-slate-800 hidden md:block">
      <div class="p-5 space-y-6">
        <h1 class="text-xl font-bold text-blue-400">PreSkool</h1>

        <nav class="space-y-2 text-sm">
          <a class="block px-3 py-2 rounded bg-slate-800">Dashboard</a>
          <a class="block px-3 py-2 rounded hover:bg-slate-800">Students</a>
          <a class="block px-3 py-2 rounded hover:bg-slate-800">Teachers</a>
          <a class="block px-3 py-2 rounded hover:bg-slate-800">Attendance</a>
          <a class="block px-3 py-2 rounded hover:bg-slate-800">Fees</a>
        </nav>
      </div>
    </aside>

    <!-- Main -->
    <div class="flex-1 flex flex-col">

      <!-- Topbar -->
      <header class="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
        <span class="text-sm text-slate-400">Academic Year: 2024–2025</span>

        <div class="flex items-center gap-3">
          <button id="logoutBtn"
            class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded text-sm">
            Logout
          </button>
        </div>
      </header>

      <!-- Content -->
      <main class="p-6 space-y-6">
        <h1 class="text-2xl font-semibold">
          Welcome back, Admin 👋
        </h1>

        <!-- Stats -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          ${StatCard("Students", "3654", "3643")}
          ${StatCard("Teachers", "284", "254")}
          ${StatCard("Staff", "162", "161")}
          ${StatCard("Subjects", "82", "81")}
        </div>
      </main>
    </div>
  </div>
  `;
}

function StatCard(title, total, active) {
  return `
  <div class="bg-slate-800 rounded-xl p-5 border border-slate-700">
    <p class="text-slate-400 text-sm">${title}</p>
    <h2 class="text-2xl font-bold mt-1">${total}</h2>
    <p class="text-xs text-green-400 mt-2">Active: ${active}</p>
  </div>
  `;
}
