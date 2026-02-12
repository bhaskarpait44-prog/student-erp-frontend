import { feeService } from "../api/fee.service.js";

export function FeeReportView() {
  return `
    <h1 class="text-2xl font-bold mb-6">Reports & Export</h1>

    <!-- Collection Report -->
    <div class="bg-slate-800 p-4 rounded mb-6">
      <h2 class="font-semibold mb-3">Collection Report</h2>

      <div class="flex gap-4 mb-4">
        <input type="date" id="startDate" class="border p-2"/>
        <input type="date" id="endDate" class="border p-2"/>
        <button id="generateReportBtn"
          class="bg-blue-600 px-4 py-2 rounded">
          Generate
        </button>
      </div>

      <p id="collectionResult"></p>
    </div>

    <!-- Defaulters -->
    <div class="bg-slate-800 p-4 rounded">
      <h2 class="font-semibold mb-3">Defaulters List</h2>

      <button id="loadDefaultersBtn"
        class="bg-red-600 px-4 py-2 rounded mb-4">
        Load Defaulters
      </button>
      <button id="exportDefaultersBtn"
  class="bg-green-600 px-4 py-2 rounded mb-4">
  Export Defaulters (CSV)
</button>


      <div id="defaultersTable"></div>
    </div>
  `;
}

export function feeReportController() {

  document.getElementById("generateReportBtn")
    .addEventListener("click", async () => {

      const start = document.getElementById("startDate").value;
      const end = document.getElementById("endDate").value;

      const res = await feeService.getCollectionReport(start, end);

      document.getElementById("collectionResult")
        .innerText = `Total Collection: ₹${res.totalCollection || 0}`;
    });


    document.getElementById("exportDefaultersBtn")
  .addEventListener("click", async () => {

    const defaulters = await feeService.getDefaulters();

    if (!defaulters.length) {
      alert("No defaulters found");
      return;
    }

    const formattedData = defaulters.map(d => ({
      RollNo: d.studentId.rollNo,
      Name: d.studentId.name,
      TotalAmount: d.totalAmount,
      Paid: d.totalPaid,
      Due: d.dueAmount,
    }));

    downloadCSV(formattedData, "defaulters.csv");
});


  document.getElementById("loadDefaultersBtn")
    .addEventListener("click", async () => {

      const defaulters = await feeService.getDefaulters();

      document.getElementById("defaultersTable").innerHTML =
        `
        <table class="w-full text-sm">
          <thead>
            <tr>
              <th>Name</th>
              <th>Roll No</th>
              <th>Due Amount</th>
            </tr>
          </thead>
          <tbody>
            ${defaulters.map(d => `
              <tr>
                <td>${d.studentId.name}</td>
                <td>${d.studentId.rollNo}</td>
                <td>₹${d.dueAmount}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
        `;
    });
}

function downloadCSV(data, filename) {
  const csvRows = [];

  // Headers
  const headers = Object.keys(data[0]);
  csvRows.push(headers.join(","));

  // Rows
  data.forEach(row => {
    const values = headers.map(header =>
      `"${row[header] ?? ""}"`
    );
    csvRows.push(values.join(","));
  });

  const blob = new Blob([csvRows.join("\n")], {
    type: "text/csv",
  });

  const url = window.URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();

  window.URL.revokeObjectURL(url);
}
