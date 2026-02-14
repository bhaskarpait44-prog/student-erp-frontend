import { request } from "../api/http.js";

/* =====================================================
   VIEW
===================================================== */

export function PromotionView() {
  return `
  <div class="space-y-10">

    <!-- HEADER -->
    <div>
      <h1 class="text-3xl font-semibold tracking-tight text-white">
        Student Promotion
      </h1>
      <p class="text-slate-400 text-sm mt-2">
        Promote students to next class in active session
      </p>
    </div>

    <!-- FILTER SECTION -->
    <div class="bg-slate-900/70 backdrop-blur-xl
                border border-slate-800 rounded-2xl
                p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div class="space-y-2">
          <label class="text-xs text-slate-400 tracking-wide">
            From Class
          </label>
          <select id="fromClass"
            class="w-full bg-slate-950 border border-slate-800
                   rounded-xl px-4 py-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   transition-all duration-300">
            <option value="">Select From Class</option>
            ${classOptions()}
          </select>
        </div>

        <div class="space-y-2">
          <label class="text-xs text-slate-400 tracking-wide">
            To Class
          </label>
          <select id="toClass"
            class="w-full bg-slate-950 border border-slate-800
                   rounded-xl px-4 py-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   transition-all duration-300">
            <option value="">Select To Class</option>
            ${classOptions()}
          </select>
        </div>

        <div class="flex items-end">
          <button id="loadStudentsBtn"
            class="w-full h-[46px]
                   bg-gradient-to-r from-indigo-600 to-blue-500
                   hover:from-indigo-500 hover:to-blue-400
                   rounded-xl text-sm font-medium
                   shadow-lg transition-all duration-300 hover:scale-105">
            Load Students
          </button>
        </div>

      </div>

    </div>

    <!-- STUDENTS TABLE SECTION -->
    <div class="bg-slate-900/70 backdrop-blur-xl
                border border-slate-800 rounded-2xl
                p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">

      <div class="flex justify-between items-center mb-6">
        <h2 class="text-lg font-semibold text-white">
          Students List
        </h2>

        <button id="promoteBtn"
          class="bg-gradient-to-r from-emerald-600 to-green-500
                 hover:from-emerald-500 hover:to-green-400
                 px-6 py-2.5 rounded-xl text-sm
                 shadow-md transition-all duration-300 hover:scale-105">
          Promote Selected
        </button>
      </div>

      <div id="studentsContainer">
        <div class="text-slate-400 text-sm">
          Select class and load students
        </div>
      </div>

    </div>

  </div>
  `;
}



/* =====================================================
   CONTROLLER
===================================================== */

export async function promotionController() {

  const fromClass = document.getElementById("fromClass");
  const toClass = document.getElementById("toClass");
  const loadBtn = document.getElementById("loadStudentsBtn");
  const promoteBtn = document.getElementById("promoteBtn");
  const container = document.getElementById("studentsContainer");

  let studentsData = [];

  /* ================= LOAD STUDENTS ================= */

  loadBtn.addEventListener("click", async () => {

    if (!fromClass.value) {
      alert("Select From Class");
      return;
    }

    try {

      studentsData = await request(
        `/student-session/class/${fromClass.value}`
      );

      if (!studentsData.length) {
        container.innerHTML =
          "<p class='text-slate-400'>No students found</p>";
        return;
      }

      renderStudents(studentsData);

    } catch (err) {
      container.innerHTML =
        "<p class='text-red-400'>Error loading students</p>";
    }
  });

  /* ================= PROMOTE ================= */

  promoteBtn.addEventListener("click", async () => {

    const selected = Array.from(
      document.querySelectorAll(".studentCheckbox:checked")
    ).map(cb => cb.value);

    if (!selected.length) {
      alert("Select students to promote");
      return;
    }

    if (!toClass.value) {
      alert("Select To Class");
      return;
    }

    try {

      const nextSessionId = await getNextSessionId();

      await request("/student-session/promote", {
        method: "POST",
        body: JSON.stringify({
          studentIds: selected,
          newClass: toClass.value,
          newSection: "A",
          nextSessionId
        })
      });

      container.innerHTML =
        "<p class='text-green-400'>Promotion Completed</p>";

    } catch (err) {
      alert("Promotion failed");
    }

  });

  /* ================= RENDER TABLE ================= */

 function renderStudents(data) {

  container.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full text-sm border-separate border-spacing-y-2">

        <thead>
          <tr class="text-slate-400 text-xs uppercase tracking-wide">
            <th class="p-3 text-left">
              <input type="checkbox" id="selectAll"
                class="accent-indigo-500 w-4 h-4" />
            </th>
            <th class="p-3 text-left">Name</th>
            <th class="p-3 text-left">Roll No</th>
            <th class="p-3 text-left">Class</th>
            <th class="p-3 text-left">Section</th>
          </tr>
        </thead>

        <tbody>
          ${data.map(s => `
            <tr class="bg-slate-950 border border-slate-800
                       hover:border-indigo-500/40
                       transition-all duration-200 rounded-xl">

              <td class="p-3">
                <input type="checkbox"
                  class="studentCheckbox accent-indigo-500 w-4 h-4"
                  value="${s._id}" />
              </td>

              <td class="p-3 font-medium text-white">
                ${s.name}
              </td>

              <td class="p-3 text-slate-400">
                ${s.rollNo}
              </td>

              <td class="p-3 text-slate-400">
                ${s.className}
              </td>

              <td class="p-3 text-slate-400">
                ${s.section || "-"}
              </td>

            </tr>
          `).join("")}
        </tbody>

      </table>
    </div>
  `;

  document.getElementById("selectAll")
    .addEventListener("change", (e) => {
      document.querySelectorAll(".studentCheckbox")
        .forEach(cb => cb.checked = e.target.checked);
    });
}


  /* ================= GET NEXT SESSION ================= */

  async function getNextSessionId() {

    const sessions = await request("/sessions");
    const active = await request("/sessions/active");

    const next = sessions.find(s => s._id !== active._id);

    return next?._id;
  }
}


/* =====================================================
   CLASS OPTIONS
===================================================== */

function classOptions() {
  const classes = [
    "LKG","UKG","1","2","3","4","5",
    "6","7","8","9","10","11","12"
  ];

  return classes
    .map(c => `<option value="${c}">${c}</option>`)
    .join("");
}
