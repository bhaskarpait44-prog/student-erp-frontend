import { feeService } from "../api/fee.service.js";

export function FeeReportView() {
  return `
    <div class="space-y-10">

      <h1 class="text-3xl font-semibold tracking-tight text-white">
        Reports & Export
      </h1>

      <!-- ================= COLLECTION REPORT ================= -->
      <div class="bg-slate-900/70 backdrop-blur-xl
                  border border-slate-800 rounded-2xl
                  p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">

        <h2 class="text-lg font-semibold mb-6 text-white">
          Collection Report
        </h2>

        <div class="grid md:grid-cols-3 gap-6 items-end">

          <!-- Start Date -->
          <div class="space-y-2">
            <label class="text-xs text-slate-400 tracking-wide">
              Start Date
            </label>
            <div class="relative">
              <input
                type="date"
                id="startDate"
                class="w-full bg-slate-950 border border-slate-800
                       rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       transition-all duration-300"
              />
            </div>
          </div>

          <!-- End Date -->
          <div class="space-y-2">
            <label class="text-xs text-slate-400 tracking-wide">
              End Date
            </label>
            <div class="relative">
              <input
                type="date"
                id="endDate"
                class="w-full bg-slate-950 border border-slate-800
                       rounded-xl px-4 py-3 text-sm
                       focus:outline-none focus:ring-2 focus:ring-indigo-500
                       transition-all duration-300"
              />
            </div>
          </div>

          <!-- Generate Button -->
          <button id="generateReportBtn"
            class="h-[46px]
                   bg-gradient-to-r from-indigo-600 to-blue-500
                   hover:from-indigo-500 hover:to-blue-400
                   rounded-xl text-sm font-medium
                   shadow-lg transition-all duration-300 hover:scale-105">
            Generate Report
          </button>

        </div>

        <!-- Result -->
        <div id="collectionResult" class="mt-8"></div>

      </div>

      <!-- ================= DEFAULTERS ================= -->
      <div class="bg-slate-900/70 backdrop-blur-xl
                  border border-slate-800 rounded-2xl
                  p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">

        <h2 class="text-lg font-semibold mb-6 text-white">
          Defaulters List
        </h2>

        <div class="flex flex-wrap gap-4 mb-6">

          <button id="loadDefaultersBtn"
            class="bg-gradient-to-r from-rose-600 to-red-500
                   hover:from-rose-500 hover:to-red-400
                   px-5 py-2.5 rounded-xl text-sm
                   shadow-md transition-all duration-300">
            Load Defaulters
          </button>

          <button id="exportDefaultersBtn"
            class="bg-gradient-to-r from-emerald-600 to-green-500
                   hover:from-emerald-500 hover:to-green-400
                   px-5 py-2.5 rounded-xl text-sm
                   shadow-md transition-all duration-300">
            Export Defaulters (CSV)
          </button>

        </div>

        <div id="defaultersTable"></div>

      </div>

    </div>
  `;
}


export function feeReportController() {

  document.getElementById("generateReportBtn")
  .addEventListener("click", async () => {

    const start = document.getElementById("startDate").value;
    const end = document.getElementById("endDate").value;

    const data = await feeService.getCollectionReport(start, end);

    if (!data.length) {
      document.getElementById("collectionResult").innerHTML =
        "<p>No records found</p>";
      return;
    }

    document.getElementById("collectionResult").innerHTML = `
      <table class="w-full text-sm">
        <thead>
          <tr>
            <th>Date</th>
            <th>Receipt</th>
            <th>Name</th>
            <th>Roll</th>
            <th>Class</th>
            <th>Type</th>
            <th>Amount</th>
            <th>Mode</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(d => `
            <tr>
              <td>${new Date(d.date).toLocaleDateString()}</td>
              <td>${d.receiptNo}</td>
              <td>${d.studentName}</td>
              <td>${d.rollNo}</td>
              <td>${d.className}</td>
              <td>${d.feeType}</td>
              <td>₹${d.amount}</td>
              <td>${d.paymentMode}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <button id="exportCollectionBtn"
        class="bg-green-600 px-4 py-2 rounded mt-4">
        Export Collection (CSV)
      </button>
    `;

    document.getElementById("exportCollectionBtn")
      .addEventListener("click", () => {
        downloadCSV(data, "collection-report.csv");
      });

  });



    document.getElementById("exportDefaultersBtn")
  .addEventListener("click", async () => {

    const defaulters = await feeService.getDefaulters();

    if (!defaulters.length) {
      alert("No defaulters found");
      return;
    }

    const formattedData = defaulters.map(d => ({
      RollNo: d.rollNo,
      Name: d.name,
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
                <td>${d.name}</td>
                <td>${d.rollNo}</td>
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
