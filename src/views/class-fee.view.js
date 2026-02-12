import { request } from "../api/http.js";

export function ClassFeeView() {
  return `
    <div class="space-y-8">

      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">
          Set Fee Structure By Class
        </h1>

        <button id="exportPdfBtn"
          class="bg-green-600 px-4 py-2 rounded">
          Export PDF
        </button>
      </div>

      <!-- FORM -->
      <div class="bg-slate-800 p-6 rounded space-y-6">

        <input id="className"
          placeholder="Class Name (e.g. LKG, 1, 2)"
          class="border p-2 w-full"/>

        <div class="grid grid-cols-3 gap-4">
          <input id="admissionFee"
            type="number"
            placeholder="Admission Fee"
            class="border p-2"/>

          <input id="yearlyFee"
            type="number"
            placeholder="Yearly Fee"
            class="border p-2"/>

          <input id="monthlyFee"
            type="number"
            placeholder="Monthly Fee"
            class="border p-2"/>
        </div>

        <button id="saveBtn"
          class="bg-blue-600 px-4 py-2 rounded">
          Save Class Fee
        </button>

      </div>

      <!-- TABLE -->
      <div class="bg-slate-800 p-6 rounded">
        <h2 class="text-lg font-semibold mb-4">
          Saved Class Fee Structures
        </h2>

        <div id="classFeeList">Loading...</div>
      </div>

    </div>
  `;
}

export async function classFeeController() {

  const listContainer = document.getElementById("classFeeList");

  async function loadClassFees() {
    const data = await request("/fee-structure");

    if (!data.length) {
      listContainer.innerHTML =
        "<p class='text-slate-400'>No class fee structure yet</p>";
      return;
    }

    listContainer.innerHTML = `
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-600">
            <th class="p-2 text-left">Class</th>
            <th class="p-2 text-left">Admission</th>
            <th class="p-2 text-left">Yearly</th>
            <th class="p-2 text-left">Monthly</th>
            <th class="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(c => `
            <tr class="border-b border-slate-700">
              <td class="p-2">${c.className}</td>
              <td class="p-2">₹${c.admissionFee}</td>
              <td class="p-2">₹${c.yearlyFee}</td>
              <td class="p-2">₹${c.monthlyFee}</td>
              <td class="p-2 space-x-3">
                <button
                  class="deleteBtn text-red-400 hover:underline"
                  data-id="${c._id}">
                  Delete
                </button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    `;

    // Attach delete events
    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (!confirm("Delete this class fee?")) return;

        await request(`/fee-structure/${btn.dataset.id}`, {
          method: "DELETE",
        });

        await loadClassFees();
      });
    });

    // Attach PDF export
    document.getElementById("exportPdfBtn")
      .addEventListener("click", () => {
        generatePDF(data);
      });
  }

  await loadClassFees();

  // Save
  document.getElementById("saveBtn")
    .addEventListener("click", async () => {

      const className = document.getElementById("className").value;

      if (!className) return alert("Enter class name");

      await request("/fee-structure", {
        method: "POST",
        body: JSON.stringify({
          className,
          admissionFee:
            +document.getElementById("admissionFee").value || 0,
          yearlyFee:
            +document.getElementById("yearlyFee").value || 0,
          monthlyFee:
            +document.getElementById("monthlyFee").value || 0,
        }),
      });

      alert("Saved successfully");

      document.getElementById("className").value = "";
      document.getElementById("admissionFee").value = "";
      document.getElementById("yearlyFee").value = "";
      document.getElementById("monthlyFee").value = "";

      await loadClassFees();
    });
}

// =============================
// PROFESSIONAL PDF EXPORT
// =============================
function generatePDF(data) {

  const content = `
    <html>
      <head>
        <title>Class Fee Report</title>
        <style>
          body { font-family: Arial; padding: 40px; }
          h1 { text-align: center; margin-bottom: 30px; }
          table {
            width: 100%;
            border-collapse: collapse;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
          }
          th {
            background: #f2f2f2;
          }
        </style>
      </head>
      <body>
        <h1>Class Fee Structure Report</h1>

        <table>
          <thead>
            <tr>
              <th>Class</th>
              <th>Admission</th>
              <th>Yearly</th>
              <th>Monthly</th>
            </tr>
          </thead>
          <tbody>
            ${data.map(c => `
              <tr>
                <td>${c.className}</td>
                <td>₹${c.admissionFee}</td>
                <td>₹${c.yearlyFee}</td>
                <td>₹${c.monthlyFee}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>

        <p style="margin-top:40px;">
          Generated on: ${new Date().toLocaleDateString()}
        </p>

      </body>
    </html>
  `;

  const win = window.open("", "_blank");

  if (!win) {
    alert("Popup blocked. Please allow popups.");
    return;
  }

  win.document.write(content);
  win.document.close();
  win.print();
}
