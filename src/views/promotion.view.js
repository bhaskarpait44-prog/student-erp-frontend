import { request } from "../api/http.js";

/* =====================================================
   VIEW
===================================================== */

export function PromotionView() {
  return `
  <div class="space-y-8">

    <!-- HEADER -->
    <div>
      <h1 class="text-3xl font-bold">Student Promotion</h1>
      <p class="text-slate-400 text-sm mt-1">
        Promote students to next class in active session
      </p>
    </div>

    <!-- FILTER SECTION -->
    <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-6">

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">

        <select id="fromClass"
          class="bg-slate-900 border border-slate-700 rounded px-4 py-2">
          <option value="">Select From Class</option>
          ${classOptions()}
        </select>

        <select id="toClass"
          class="bg-slate-900 border border-slate-700 rounded px-4 py-2">
          <option value="">Select To Class</option>
          ${classOptions()}
        </select>

        <button id="loadStudentsBtn"
          class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg">
          Load Students
        </button>

      </div>

    </div>

    <!-- STUDENTS TABLE -->
    <div class="bg-slate-800 p-6 rounded-2xl border border-slate-700">

      <div class="flex justify-between items-center mb-4">
        <h2 class="text-lg font-semibold">Students List</h2>

        <button id="promoteBtn"
          class="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg">
          Promote Selected
        </button>
      </div>

      <div id="studentsContainer">
        <p class="text-slate-400">Select class and load students</p>
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
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-700">
            <th class="p-2 text-left">
              <input type="checkbox" id="selectAll" />
            </th>
            <th class="p-2 text-left">Name</th>
            <th class="p-2 text-left">Roll No</th>
            <th class="p-2 text-left">Class</th>
            <th class="p-2 text-left">Section</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(s => `
            <tr class="border-b border-slate-700 hover:bg-slate-700">
              <td class="p-2">
                <input type="checkbox"
                  class="studentCheckbox"
                  value="${s._id}" />
              </td>
              <td class="p-2">${s.name}</td>
              <td class="p-2">${s.rollNo}</td>
              <td class="p-2">${s.className}</td>
              <td class="p-2">${s.section || "-"}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
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
