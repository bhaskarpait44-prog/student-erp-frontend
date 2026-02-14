export function DashboardView() {
  return `
  <div class="h-screen flex bg-slate-900 text-slate-200">

    <!-- ================= SIDEBAR ================= -->
    <aside class="w-64 bg-slate-950 border-r border-slate-800 fixed left-0 top-0 h-screen shadow-lg">

      <div class="flex flex-col h-full">

        <!-- LOGO -->
        <div class="px-6 py-5 border-b border-slate-800">
          <h1 class="text-xl font-bold text-blue-400 tracking-wide">
            PreSkool ERP
          </h1>
          <p class="text-xs text-slate-500 mt-1">
            School Management System
          </p>
        </div>

        <!-- NAVIGATION -->
        <div class="flex-1 overflow-y-auto px-4 py-6 space-y-6">

          <nav class="space-y-1 text-sm">

            <a href="#/dashboard"
              class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition">
              🏠 Dashboard
            </a>

            <a href="#/students"
              class="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition">
              🎓 Students
            </a>

            <!-- FEE DROPDOWN -->
            <div class="space-y-1">

              <button id="feeDropdownBtn"
                class="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-slate-800 transition">

                <div class="flex items-center gap-3">
                  💰 Fee Collection
                </div>

                <span id="feeArrow"
                  class="text-xs transition-transform duration-200">
                  ▼
                </span>
              </button>

              <div id="feeDropdownMenu"
                class="hidden ml-8 space-y-1">

                <a href="#/class-fee"
                  class="block px-3 py-2 rounded-lg hover:bg-slate-800 transition">
                  Set Class Amount
                </a>

                <a href="#/fees"
                  class="block px-3 py-2 rounded-lg hover:bg-slate-800 transition">
                  Fee Payment
                </a>

                <a href="#/fee-status"
                  class="block px-3 py-2 rounded-lg hover:bg-slate-800 transition">
                  Fee Status
                </a>

                <a href="#/fee-reports"
                  class="block px-3 py-2 rounded-lg hover:bg-slate-800 transition">
                  Fee Report
                </a>

              </div>
            </div>

            <a href="#/sessions"
              class="block px-3 py-2 rounded hover:bg-slate-800">
              📅 Academic Sessions
            </a>
            <a href="#/promotions"
  class="block px-3 py-2 rounded hover:bg-slate-800">
  🎓 Promotion
</a>


          </nav>
        </div>

        <div class="px-6 py-4 border-t border-slate-800 text-xs text-slate-500">
          © 2026 PreSkool ERP
        </div>

      </div>
    </aside>

    <!-- ================= MAIN ================= -->
    <div class="flex-1 ml-64 flex flex-col">

      <!-- TOPBAR -->
      <header
        class="h-16 bg-slate-900 border-b border-slate-800
               fixed left-64 right-0 top-0
               flex items-center justify-between px-6 z-40">

        <!-- SESSION DROPDOWN -->
        <div class="relative">

          <button id="sessionBtn"
            class="bg-slate-800 px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition text-sm flex items-center gap-2">
            <p>📅&nbsp;Academic Year</>
            <span id="sessionText">Loading...</span>
            <span id="sessionArrow" class="text-xs transition-transform">
              ▼
            </span>

          </button>

          <div id="sessionMenu"
            class="hidden absolute left-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-lg shadow-lg z-50">
          </div>

        </div>

        <!-- LOGOUT -->
        <button id="logoutBtn"
          class="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg text-sm transition">
          Logout
        </button>

      </header>

      <!-- PAGE CONTENT -->
      <main id="pageContent"
        class="mt-16 p-8 overflow-y-auto h-[calc(100vh-4rem)]">
      </main>

    </div>
  </div>
  `;
}
