import { getToken } from "../auth/auth.store.js";

export default function attendanceView(studentId) {
  const page = document.getElementById("pageContent");

  page.innerHTML = `
    <div class="p-6">

      <!-- HEADER -->
<div class="flex justify-between items-center mb-6">

  <div class="flex items-center gap-4">

    <!-- BACK BUTTON -->
    <button id="backBtn"
      class="bg-slate-800 hover:bg-slate-700
             px-4 py-2 rounded-lg text-sm
             transition-all duration-300 shadow-md">
      ← Back
    </button>

    <h2 class="text-2xl font-semibold">Attendance</h2>

  </div>

  <div class="text-sm text-slate-400">
    Active Session
  </div>

</div>


      <!-- SUMMARY CARDS -->
      <div id="attendanceSummary"
        class="grid grid-cols-4 gap-6 mb-8">
      </div>

      <!-- ATTENDANCE GRID -->
      <div class="bg-slate-900 rounded-xl shadow-xl p-6 overflow-x-auto">
        <table class="w-full text-sm text-center">
          <thead>
            <tr class="text-slate-400">
              <th class="p-2 text-left">Date</th>
              ${generateMonthHeaders()}
            </tr>
          </thead>
          <tbody id="attendanceGrid"></tbody>
        </table>
      </div>

    </div>
  `;

  document.getElementById("backBtn")
  ?.addEventListener("click", () => {
    window.location.hash = `#/student-details?id=${studentId}`;
  });


  loadAttendance(studentId);
}

/* ================================
   LOAD DATA
================================ */

async function loadAttendance(studentId) {
  try {

    const res = await fetch(
      `${import.meta.env.VITE_API_BASE}/attendance/${studentId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }
    );

    const result = await res.json();

    // ✅ Works for both response types
    const data = Array.isArray(result) ? result : (result.data || []);

    renderSummary(data);
    renderGrid(data);

  } catch (err) {
    console.error(err);
  }
}


/* ================================
   SUMMARY
================================ */

function renderSummary(data) {
  const summary = document.getElementById("attendanceSummary");

  const counts = {
    present: 0,
    absent: 0,
    late: 0,
    halfday: 0
  };

  data.forEach(item => {
    if (counts[item.status] !== undefined) {
      counts[item.status]++;
    }
  });

  summary.innerHTML = `
    ${card("Present", counts.present, "green")}
    ${card("Absent", counts.absent, "red")}
    ${card("Late", counts.late, "yellow")}
    ${card("Half Day", counts.halfday, "blue")}
  `;
}

function card(title, value, color) {
  return `
    <div class="bg-${color}-600/20 border border-${color}-500/40
                rounded-xl p-6 text-center shadow-lg">
      <p class="text-sm text-${color}-300">${title}</p>
      <p class="text-2xl font-bold text-${color}-400">${value}</p>
    </div>
  `;
}

/* ================================
   GRID (Preskool Style)
================================ */

function generateMonthHeaders() {
  const months = [
    "Jun","Jul","Aug","Sep","Oct",
    "Nov","Dec","Jan","Feb","Mar","Apr"
  ];

  return months
    .map(m => `<th class="p-2">${m}</th>`)
    .join("");
}

function renderGrid(data) {

  const grid = document.getElementById("attendanceGrid");

  let rows = "";

  for (let day = 1; day <= 31; day++) {

    rows += `<tr class="border-b border-slate-800">
      <td class="p-2 text-left text-slate-400">${String(day).padStart(2,"0")}</td>`;

    const months = [
      5,6,7,8,9,10,11,0,1,2,3
    ]; // Jun → Apr (JS month index)

    months.forEach(month => {

      const record = data.find(item => {
        const d = new Date(item.date);
        return d.getDate() === day && d.getMonth() === month;
      });

      rows += `<td class="p-2">
        ${record ? statusDot(record.status) : ""}
      </td>`;
    });

    rows += `</tr>`;
  }

  grid.innerHTML = rows;
}

function statusDot(status) {

  const colors = {
    present: "bg-green-500",
    absent: "bg-red-500",
    late: "bg-yellow-400",
    halfday: "bg-blue-500",
  };

  return `
    <div class="w-3 h-3 mx-auto rounded-full ${colors[status]}">
    </div>
  `;
}
