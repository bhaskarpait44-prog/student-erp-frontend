import { request } from "../api/http.js";

export function FeeStatusView() {
  return `
  <div class="space-y-8">

    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">Fee Status</h1>
        <p class="text-slate-400 text-sm">
          Session based fee tracking
        </p>
      </div>

      <div class="flex gap-3">
        <button id="exportPdf"
          class="bg-green-600 hover:bg-green-500 px-4 py-2 rounded-lg">
          Export PDF
        </button>

        <button id="exportExcel"
          class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg">
          Export Excel
        </button>
      </div>
    </div>

    <!-- FILTER -->
    <div class="bg-slate-800 p-5 rounded-xl border border-slate-700">
      <select id="classFilter"
        class="bg-slate-900 border border-slate-700 px-4 py-2 rounded-lg">
        <option value="">All Classes</option>
      </select>
    </div>

    <!-- TABLE -->
    <div class="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-slate-900 border-b border-slate-700">
            <tr>
              <th class="p-3 text-left">Name</th>
              <th class="p-3 text-left">Roll</th>
              <th class="p-3 text-left">Class</th>
              <th class="p-3 text-left">Total</th>
              <th class="p-3 text-left">Paid</th>
              <th class="p-3 text-left">Due</th>
              <th class="p-3 text-left">Status</th>
              <th class="p-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody id="feeStatusTable"></tbody>
        </table>
      </div>
    </div>

  </div>
  `;
}

export async function feeStatusController() {

  const table = document.getElementById("feeStatusTable");
  const filter = document.getElementById("classFilter");

  let data = [];

  async function load(className = "") {
    const query = className ? `?className=${className}` : "";
    data = await request(`/fees/status/all${query}`);
    render(data);
    loadClassOptions(data);
  }

  function render(rows) {
    table.innerHTML = rows.map(r => `
      <tr class="border-b border-slate-700 hover:bg-slate-900">
        <td class="p-3">${r.name}</td>
        <td class="p-3">${r.rollNo}</td>
        <td class="p-3">${r.className}</td>
        <td class="p-3">₹${r.totalAmount}</td>
        <td class="p-3 text-green-400">₹${r.totalPaid}</td>
        <td class="p-3 text-red-400">₹${r.dueAmount}</td>
        <td class="p-3">
          <span class="${r.status === "Paid"
            ? "text-green-400"
            : "text-yellow-400"}">
            ${r.status}
          </span>
        </td>
        <td class="p-3">
          <button
            data-id="${r.studentId}"
            class="payBtn bg-blue-600 px-3 py-1 rounded text-xs">
            Pay
          </button>
        </td>
      </tr>
    `).join("");

    document.querySelectorAll(".payBtn")
      .forEach(btn => {
        btn.addEventListener("click", () => {
          window.location.hash = `#/fees?studentId=${btn.dataset.id}`;
        });
      });
  }

  function loadClassOptions(rows) {
    const classes = [...new Set(rows.map(r => r.className))];

    filter.innerHTML =
      `<option value="">All Classes</option>` +
      classes.map(c =>
        `<option value="${c}">${c}</option>`
      ).join("");
  }

  filter.addEventListener("change", () => {
    load(filter.value);
  });

  /* EXPORT PDF */
  document.getElementById("exportPdf")
    .addEventListener("click", () => {
      generatePDF(data);
    });

  /* EXPORT EXCEL */
  document.getElementById("exportExcel")
    .addEventListener("click", () => {
      exportExcel(data);
    });

  await load();
}


function generatePDF(data) {

  const html = `
    <html>
    <head>
      <title>Fee Report</title>
      <style>
        body { font-family: Arial; padding: 40px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 8px; }
      </style>
    </head>
    <body>
      <h2>Fee Status Report</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll</th>
            <th>Class</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Due</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(d => `
            <tr>
              <td>${d.name}</td>
              <td>${d.rollNo}</td>
              <td>${d.className}</td>
              <td>${d.totalAmount}</td>
              <td>${d.totalPaid}</td>
              <td>${d.dueAmount}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
}

function exportExcel(data) {

  const csv = [
    ["Name","Roll","Class","Total","Paid","Due"],
    ...data.map(d => [
      d.name,
      d.rollNo,
      d.className,
      d.totalAmount,
      d.totalPaid,
      d.dueAmount
    ])
  ]
  .map(e => e.join(","))
  .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "fee_status.csv";
  a.click();
}
