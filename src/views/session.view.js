import { request } from "../api/http.js";

export function SessionView() {
  return `
  <div class="max-w-6xl mx-auto space-y-10">

    <!-- PAGE HEADER -->
    <div>
      <h1 class="text-3xl font-bold">Academic Sessions</h1>
      <p class="text-slate-400 text-sm">
        Manage academic years and promotions
      </p>
    </div>

    <!-- CREATE SESSION CARD -->
    <div class="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">

      <h2 class="text-lg font-semibold mb-4">
        Create New Session
      </h2>

      <div class="grid md:grid-cols-3 gap-4">

        <input id="sessionName"
          placeholder="Session Name (2025-2026)"
          class="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"/>

        <input id="startDate"
          type="date"
          class="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"/>

        <input id="endDate"
          type="date"
          class="bg-slate-900 border border-slate-700 rounded-lg px-4 py-2"/>
      </div>

      <button id="createSessionBtn"
        class="mt-5 bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-semibold transition">
        Create Session
      </button>
    </div>

    <!-- ALL SESSIONS -->
    <div class="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">

      <h2 class="text-lg font-semibold mb-6">
        All Sessions
      </h2>

      <div id="sessionList" class="space-y-4">
        Loading...
      </div>

    </div>

  </div>
  `;
}

/* ========================================
   CONTROLLER
======================================== */

export async function sessionController() {

  const list = document.getElementById("sessionList");

  async function loadSessions() {

    const sessions = await request("/sessions");

    if (!sessions.length) {
      list.innerHTML =
        `<p class="text-slate-400">No sessions found</p>`;
      return;
    }

    list.innerHTML = sessions.map(s => `
      <div class="flex justify-between items-center
                  bg-slate-900 border border-slate-700
                  rounded-xl px-5 py-4">

        <div>
          <h3 class="font-semibold text-lg">
            ${s.name}
            ${s.isActive
              ? `<span class="text-green-400 text-sm ml-2">(Active)</span>`
              : ""}
          </h3>

          <p class="text-slate-400 text-sm">
            ${new Date(s.startDate).toLocaleDateString()}
            →
            ${new Date(s.endDate).toLocaleDateString()}
          </p>
        </div>

        <div class="flex gap-3">

          ${
            !s.isActive
              ? `
                <button
                  data-activate="${s._id}"
                  class="activateBtn bg-green-600 hover:bg-green-500
                         px-4 py-2 rounded-lg text-sm transition">
                  Activate
                </button>
              `
              : ""
          }

          ${
            !s.isActive
              ? `
                <button
                  data-delete="${s._id}"
                  class="deleteBtn bg-red-600 hover:bg-red-500
                         px-4 py-2 rounded-lg text-sm transition">
                  Delete
                </button>
              `
              : ""
          }

        </div>
      </div>
    `).join("");

    // ACTIVATE
    document.querySelectorAll(".activateBtn")
      .forEach(btn => {
        btn.addEventListener("click", async () => {
          await request(
            `/sessions/activate/${btn.dataset.activate}`,
            { method: "PUT" }
          );
          loadSessions();
        });
      });

    // DELETE
    document.querySelectorAll(".deleteBtn")
      .forEach(btn => {
        btn.addEventListener("click", async () => {

          if (!confirm("Delete this session? This cannot be undone."))
            return;

          await request(
            `/sessions/${btn.dataset.delete}`,
            { method: "DELETE" }
          );

          loadSessions();
        });
      });
  }

  // CREATE
  document.getElementById("createSessionBtn")
    .addEventListener("click", async () => {

      const name =
        document.getElementById("sessionName").value;

      const start =
        document.getElementById("startDate").value;

      const end =
        document.getElementById("endDate").value;

      if (!name || !start || !end)
        return alert("All fields required");

      await request("/sessions", {
        method: "POST",
        body: JSON.stringify({
          name,
          startDate: start,
          endDate: end
        })
      });

      document.getElementById("sessionName").value = "";
      document.getElementById("startDate").value = "";
      document.getElementById("endDate").value = "";

      loadSessions();
    });

  loadSessions();
}
