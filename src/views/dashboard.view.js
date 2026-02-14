export function DashboardView() {
  return `
  <div class="h-screen flex bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-200 antialiased">

    <!-- ================= SIDEBAR ================= -->
    <aside class="w-72 bg-slate-950/70 backdrop-blur-2xl border-r border-slate-800 fixed left-0 top-0 h-screen shadow-[0_0_60px_rgba(0,0,0,0.6)] transition-all duration-500">

      <div class="flex flex-col h-full">

        <!-- BRAND -->
        <div class="px-8 py-8 flex items-center gap-4">

          <div class="relative">
            <div class="absolute inset-0 bg-indigo-500 blur-xl opacity-40 rounded-2xl"></div>
            <div class="relative h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-xl">
              <span class="text-white font-bold tracking-wider">SE</span>
            </div>
          </div>

          <div>
            <h1 class="text-xl font-semibold tracking-wide text-white">
              Control Panel
            </h1>
            <p class="text-xs text-slate-500 mt-1">
              Education Management
            </p>
          </div>

        </div>

        <!-- NAVIGATION -->
        <div class="flex-1 overflow-y-auto px-6 space-y-3">

          <nav class="space-y-1 text-sm font-medium">

            <a href="#/dashboard"
              class="group flex items-center gap-3 px-4 py-3 rounded-xl
                     hover:bg-slate-800/60 transition-all duration-300
                     hover:translate-x-1 hover:shadow-lg">
              <span class="text-lg transition-transform duration-300 group-hover:scale-110">🏠</span>
              Dashboard
            </a>

            <a href="#/students"
              class="group flex items-center gap-3 px-4 py-3 rounded-xl
                     hover:bg-slate-800/60 transition-all duration-300
                     hover:translate-x-1 hover:shadow-lg">
              <span class="text-lg transition-transform duration-300 group-hover:scale-110">🎓</span>
              Students
            </a>

            <!-- FINANCE DROPDOWN -->
            <div class="space-y-2">

              <button id="feeDropdownBtn"
                class="group w-full flex items-center justify-between px-4 py-3 rounded-xl
                       hover:bg-slate-800/60 transition-all duration-300">

                <div class="flex items-center gap-3">
                  <span class="text-lg transition-transform duration-300 group-hover:scale-110">💰</span>
                  Finance
                </div>

                <span id="feeArrow"
                  class="text-xs transition-transform duration-300 group-hover:rotate-180">
                  ▼
                </span>
              </button>

              <div id="feeDropdownMenu"
                class="hidden relative mt-2">

                <div class="bg-slate-900/90 backdrop-blur-xl
                            border border-slate-800
                            rounded-2xl
                            shadow-[0_20px_60px_rgba(0,0,0,0.7)]
                            p-2 space-y-1
                            transition-all duration-300">

                  <a href="#/class-fee"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl
                           hover:bg-slate-800/70 transition-all duration-200 hover:translate-x-1">
                    🏫 Set Class Amount
                  </a>

                  <a href="#/fees"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl
                           hover:bg-slate-800/70 transition-all duration-200 hover:translate-x-1">
                    💳 Fee Payment
                  </a>

                  <a href="#/fee-status"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl
                           hover:bg-slate-800/70 transition-all duration-200 hover:translate-x-1">
                    📊 Fee Status
                  </a>

                  <a href="#/fee-reports"
                    class="flex items-center gap-3 px-4 py-3 rounded-xl
                           hover:bg-slate-800/70 transition-all duration-200 hover:translate-x-1">
                    📈 Fee Reports
                  </a>

                </div>

              </div>
            </div>

            <a href="#/sessions"
              class="group flex items-center gap-3 px-4 py-3 rounded-xl
                     hover:bg-slate-800/60 transition-all duration-300
                     hover:translate-x-1 hover:shadow-lg">
              <span class="text-lg transition-transform duration-300 group-hover:scale-110">📅</span>
              Academic Sessions
            </a>

            <a href="#/promotions"
              class="group flex items-center gap-3 px-4 py-3 rounded-xl
                     hover:bg-slate-800/60 transition-all duration-300
                     hover:translate-x-1 hover:shadow-lg">
              <span class="text-lg transition-transform duration-300 group-hover:scale-110">🚀</span>
              Promotion
            </a>

          </nav>
        </div>

      </div>
    </aside>

    <!-- ================= MAIN ================= -->
    <div class="flex-1 ml-72 flex flex-col">

      <!-- TOPBAR -->
      <header
        class="h-20 bg-slate-950/60 backdrop-blur-2xl border-b border-slate-800
               fixed left-72 right-0 top-0
               flex items-center justify-between px-10 z-40
               transition-all duration-500">

        <!-- SESSION -->
        <div class="relative">

          <button id="sessionBtn"
            class="bg-slate-800/50 backdrop-blur-md px-6 py-3 rounded-xl
                   border border-slate-700 hover:bg-slate-700/70
                   transition-all duration-300 text-sm flex items-center gap-3 shadow-lg">

            <span>📅 Academic Year</span>
            <span id="sessionText" class="text-slate-300 font-medium">
              Loading...
            </span>
            <span id="sessionArrow" class="text-xs transition-transform duration-300">
              ▼
            </span>

          </button>

          <div id="sessionMenu"
            class="hidden absolute left-0 mt-3 w-64
                   bg-slate-900 border border-slate-700
                   rounded-xl shadow-2xl z-50 overflow-hidden">
          </div>

        </div>

        <!-- RIGHT SIDE -->
        <div class="flex items-center gap-6">

          <div class="text-sm text-slate-400 tracking-wide">
            Administrator
          </div>

          <button id="logoutBtn"
            class="bg-gradient-to-r from-rose-600 to-red-500
                   hover:from-rose-500 hover:to-red-400
                   px-6 py-2.5 rounded-xl text-sm font-medium
                   transition-all duration-300 shadow-xl hover:scale-105">
            Logout
          </button>

        </div>

      </header>

      <!-- PAGE CONTENT -->
      <main id="pageContent"
        class="mt-20 p-12 overflow-y-auto h-[calc(100vh-5rem)]
               transition-all duration-500 ease-in-out">
      </main>

    </div>

  </div>
  `;
}

