export function DashboardHomeView() {
  return `
    <h1 class="text-2xl font-semibold mb-6">
      Welcome back, Admin 👋
    </h1>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      ${StatCard("Students", "3654", "3643")}
      ${StatCard("Teachers", "284", "254")}
      ${StatCard("Staff", "162", "161")}
      ${StatCard("Subjects", "82", "81")}
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
