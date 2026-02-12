import { getStudents } from "../api/student.service.js";
import { feeService } from "../api/fee.service.js";

/* ===============================
   VIEW
================================ */
export function FeeStatusView() {
  return `
  <div class="space-y-8">

    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">Fee Payment Status</h1>
        <p class="text-slate-400 text-sm">
          View payment details class-wise
        </p>
      </div>

      <div class="relative">
        <button id="filterBtn"
          class="bg-slate-800 border border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-700">
          Filter ▾
        </button>

        <div id="filterPanel"
          class="hidden absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-lg p-4 space-y-4 z-50">

          <div>
            <label class="text-sm text-slate-400">Select Class</label>
            <select id="classFilter"
              class="w-full mt-1 border border-slate-700 bg-slate-800 rounded-lg px-3 py-2">
              <option value="">All Classes</option>
            </select>
          </div>

          <div class="flex justify-end gap-2">
            <button id="resetFilter"
              class="text-sm text-slate-400 hover:text-white">
              Reset
            </button>
            <button id="applyFilter"
              class="bg-blue-600 px-3 py-1 rounded text-sm">
              Apply
            </button>
          </div>

        </div>
      </div>
    </div>

    <div class="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="border-b border-slate-700">
            <tr>
              <th class="p-2 text-left">Student</th>
              <th class="p-2 text-left">Class</th>
              <th class="p-2 text-left">Total</th>
              <th class="p-2 text-left">Paid</th>
              <th class="p-2 text-left">Balance</th>
              <th class="p-2 text-left">Status</th>
              <th class="p-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody id="statusTable"></tbody>
        </table>
      </div>
    </div>

  </div>
  `;
}

/* ===============================
   CONTROLLER
================================ */
export async function feeStatusController() {

  const students = await getStudents();
  const feeRes = await feeService.getAllFees();
  const fees = (feeRes.data || feeRes) || [];

  const table = document.getElementById("statusTable");
  const classFilter = document.getElementById("classFilter");
  const filterBtn = document.getElementById("filterBtn");
  const filterPanel = document.getElementById("filterPanel");
  const applyFilter = document.getElementById("applyFilter");
  const resetFilter = document.getElementById("resetFilter");

  /* ===============================
     Merge Students + Fees
  =============================== */

  const merged = students.map(student => {

    const fee = fees.find(
      f => f.studentId && f.studentId._id === student._id
    );

    return {
      student,
      totalAmount: fee?.totalAmount || 0,
      totalPaid: fee?.totalPaid || 0,
      dueAmount: fee?.dueAmount || 0,
    };
  });

  /* ===============================
     Populate Class Filter (FROM STUDENTS)
  =============================== */

  const classes = [...new Set(
    students.map(s => s.className)
  )];

  classFilter.innerHTML =
    `<option value="">All Classes</option>` +
    classes.map(c =>
      `<option value="${c}">${c}</option>`
    ).join("");

  /* ===============================
     Render Table
  =============================== */

  function render(data) {

    table.innerHTML = data.map(f => {

      const status =
        f.dueAmount === 0 && f.totalAmount > 0
          ? "Paid"
          : f.totalPaid === 0
            ? "Unpaid"
            : "Partial";

      const statusColor =
        status === "Paid"
          ? "text-green-400"
          : status === "Unpaid"
            ? "text-red-400"
            : "text-yellow-400";

      return `
        <tr class="border-b border-slate-700">
          <td class="p-2 font-medium">${f.student.name}</td>
          <td class="p-2">${f.student.className}</td>
          <td class="p-2">₹${f.totalAmount}</td>
          <td class="p-2 text-green-400">₹${f.totalPaid}</td>
          <td class="p-2 text-red-400">₹${f.dueAmount}</td>
          <td class="p-2 ${statusColor} font-semibold">${status}</td>
          <td class="p-2">
            <button
              data-id="${f.student._id}"
              class="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-xs payNowBtn">
              Pay
            </button>
          </td>
        </tr>
      `;
    }).join("");

    document.querySelectorAll(".payNowBtn")
      .forEach(btn => {
        btn.addEventListener("click", () => {
          window.location.hash =
            `#/fees?studentId=${btn.dataset.id}`;
        });
      });
  }

  render(merged);

  /* ===============================
     Filter Logic
  =============================== */

  filterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    filterPanel.classList.toggle("hidden");
  });

  applyFilter.addEventListener("click", () => {

    const selectedClass = classFilter.value;

    const filtered =
      selectedClass
        ? merged.filter(
            f => f.student.className === selectedClass
          )
        : merged;

    render(filtered);
    filterPanel.classList.add("hidden");
  });

  resetFilter.addEventListener("click", () => {
    classFilter.value = "";
    render(merged);
    filterPanel.classList.add("hidden");
  });

  document.addEventListener("click", (e) => {
    if (
      !filterPanel.contains(e.target) &&
      !filterBtn.contains(e.target)
    ) {
      filterPanel.classList.add("hidden");
    }
  });
}
