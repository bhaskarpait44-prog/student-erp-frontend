import { getStudents } from "../api/student.service.js";
import { feeService } from "../api/fee.service.js";

let currentFee = null;

/* ===============================
   VIEW
================================ */
export function FeeView() {
  return `
  <div class="space-y-8">

    <div>
      <h1 class="text-3xl font-bold">Fee Management</h1>
      <p class="text-slate-400 text-sm">
        Manage student payments and fee records
      </p>
    </div>

    <!-- FILTER -->
    <div class="bg-slate-800 p-6 rounded-2xl shadow-lg">
      <div class="grid md:grid-cols-2 gap-4">

        <div>
          <label class="text-sm text-slate-400">Select Class</label>
          <select id="classSelect"
            class="w-full mt-1 border border-slate-700 bg-slate-900 rounded-lg px-3 py-2">
            <option>Loading...</option>
          </select>
        </div>

        <div>
          <label class="text-sm text-slate-400">Select Student</label>
          <select id="studentSelect"
            class="w-full mt-1 border border-slate-700 bg-slate-900 rounded-lg px-3 py-2">
            <option>Select Student</option>
          </select>
        </div>

      </div>
    </div>

    <!-- STUDENT INFO -->
    <div id="studentInfo"
      class="hidden bg-slate-800 p-6 rounded-2xl shadow-lg">
    </div>

    <!-- SUMMARY -->
    <div id="feeSummary"
      class="hidden grid md:grid-cols-3 gap-6">
    </div>

    <!-- PAYMENT -->
    <div id="paymentPanel"
      class="hidden bg-slate-800 p-6 rounded-2xl shadow-lg space-y-4">

      <h3 class="text-lg font-semibold">
        Record Payment
      </h3>

      <div class="grid md:grid-cols-3 gap-4">

        <select id="feeType"
          class="border border-slate-700 bg-slate-900 rounded-lg px-3 py-2">
          <option value="Admission">Admission</option>
          <option value="Yearly">Yearly</option>
          <option value="Monthly">Monthly</option>
        </select>

        <input id="paymentAmount"
          type="number"
          placeholder="Enter Amount"
          class="border border-slate-700 bg-slate-900 rounded-lg px-3 py-2"/>

        <select id="paymentMode"
          class="border border-slate-700 bg-slate-900 rounded-lg px-3 py-2">
          <option value="Cash">Cash</option>
          <option value="UPI">UPI</option>
          <option value="Bank">Bank</option>
        </select>

      </div>

      <button id="payBtn"
        class="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-lg font-semibold transition">
        Submit Payment
      </button>

    </div>

    <!-- PAYMENT HISTORY -->
    <div id="paymentHistory"
      class="hidden bg-slate-800 p-6 rounded-2xl shadow-lg">
    </div>

  </div>
  `;
}

/* ===============================
   CONTROLLER
================================ */
export async function feeEvents() {

  const classSelect = document.getElementById("classSelect");
  const studentSelect = document.getElementById("studentSelect");
  const payBtn = document.getElementById("payBtn");

  const students = await getStudents();

  const classes = [...new Set(
    students.map(s => s.className).filter(Boolean)
  )];

  classSelect.innerHTML =
    `<option value="">Select Class</option>` +
    classes.map(c =>
      `<option value="${c}">${c}</option>`
    ).join("");

  classSelect.addEventListener("change", () => {

    const filtered = students.filter(
      s => s.className === classSelect.value
    );

    studentSelect.innerHTML =
      `<option value="">Select Student</option>` +
      filtered.map(s =>
        `<option value="${s._id}">
          ${s.name} (${s.rollNo})
        </option>`
      ).join("");
  });

  studentSelect.addEventListener("change", () => {
    if (!studentSelect.value) return;
    loadFee(studentSelect.value);
  });

  payBtn.addEventListener("click", async () => {

    const amount =
      +document.getElementById("paymentAmount").value;

    if (!amount || amount <= 0)
      return alert("Enter valid amount");

    if (amount > currentFee.dueAmount)
      return alert("Cannot pay more than due amount");

    await feeService.addPayment({
      studentId: studentSelect.value,
      feeType: document.getElementById("feeType").value,
      amount,
      paymentMode: document.getElementById("paymentMode").value,
    });

    alert("Payment successful");
    loadFee(studentSelect.value);
  });
}

/* ===============================
   LOAD FEE
================================ */
async function loadFee(studentId) {

  const res =
    await feeService.getFeeByStudent(studentId);

  const fee = res.data || res;
  currentFee = fee;

  renderStudentInfo(fee.studentId);
  renderFeeSummary(fee);
  renderPaymentHistory(fee);

  document.getElementById("paymentPanel")
    .classList.remove("hidden");
}

/* ===============================
   STUDENT INFO
================================ */
function renderStudentInfo(student) {

  const box = document.getElementById("studentInfo");
  box.classList.remove("hidden");

  box.innerHTML = `
    <h2 class="text-xl font-semibold mb-2">
      ${student.name}
    </h2>
    <p class="text-slate-400">
      Roll No: ${student.rollNo}
      | Class: ${student.className}
      | Mobile: ${student.mobile || "-"}
    </p>
  `;
}

/* ===============================
   SUMMARY
================================ */
function renderFeeSummary(fee) {

  const box = document.getElementById("feeSummary");
  box.classList.remove("hidden");

  box.innerHTML = `
    ${summaryCard("Total Fee", fee.totalAmount, "blue")}
    ${summaryCard("Paid", fee.totalPaid, "green")}
    ${summaryCard("Due", fee.dueAmount, "red")}
  `;

  document.getElementById("paymentAmount").value =
    fee.dueAmount > 0 ? fee.dueAmount : "";
}

function summaryCard(title, amount, color) {
  return `
    <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6">
      <p class="text-slate-400 text-sm">${title}</p>
      <h3 class="text-2xl font-bold text-${color}-400">
        ₹${amount}
      </h3>
    </div>
  `;
}

/* ===============================
   PAYMENT HISTORY
================================ */
function renderPaymentHistory(fee) {

  const box = document.getElementById("paymentHistory");
  box.classList.remove("hidden");

  box.innerHTML = `
    <h3 class="text-lg font-semibold mb-4">
      Payment History
    </h3>

    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead class="border-b border-slate-700">
          <tr>
            <th class="p-2 text-left">Receipt</th>
            <th class="p-2 text-left">Type</th>
            <th class="p-2 text-left">Amount</th>
            <th class="p-2 text-left">Mode</th>
            <th class="p-2 text-left">Date</th>
            <th class="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          ${
            fee.payments.length === 0
              ? `<tr>
                   <td colspan="6"
                     class="p-4 text-center text-slate-400">
                     No payments yet
                   </td>
                 </tr>`
              : fee.payments.map((p, index) => `
                <tr class="border-b border-slate-700">
                  <td class="p-2">${p.receiptNo}</td>
                  <td class="p-2">${p.feeType}</td>
                  <td class="p-2">₹${p.amount}</td>
                  <td class="p-2">${p.paymentMode}</td>
                  <td class="p-2">
                    ${new Date(p.paymentDate)
                      .toLocaleDateString()}
                  </td>
                  <td class="p-2 space-x-3">
                    <button
                      class="printBtn text-blue-400 hover:text-blue-300"
                      data-index="${index}">
                      Print
                    </button>

                    <button
                      class="deleteBtn text-red-400 hover:text-red-300"
                      data-index="${index}">
                      Delete
                    </button>
                  </td>
                </tr>
              `).join("")
          }
        </tbody>
      </table>
    </div>
  `;

  /* PRINT */
  document.querySelectorAll(".printBtn")
    .forEach(btn => {
      btn.addEventListener("click", () => {
        const payment =
          fee.payments[btn.dataset.index];
        printReceipt(payment, fee.studentId);
      });
    });

  /* DELETE */
  document.querySelectorAll(".deleteBtn")
    .forEach(btn => {
      btn.addEventListener("click", async () => {

        const payment =
          fee.payments[btn.dataset.index];

        const confirmDelete = confirm(
          `Are you sure you want to delete receipt ${payment.receiptNo}?`
        );

        if (!confirmDelete) return;

        await feeService.deletePayment({
          studentId: fee.studentId._id,
          receiptNo: payment.receiptNo,
        });

        alert("Receipt deleted successfully");
        loadFee(fee.studentId._id);
      });
    });
}

/* ===============================
   PRINT RECEIPT
================================ */
function printReceipt(payment, student) {

  const html = `
    <html>
      <head>
        <title>Fee Receipt</title>
        <style>
          body { font-family: Arial; padding: 40px; }
          .box {
            border: 1px solid #000;
            padding: 20px;
            width: 400px;
          }
          h2 { margin-bottom: 20px; }
        </style>
      </head>
      <body>
        <div class="box">
          <h2>School Fee Receipt</h2>
          <p><strong>Receipt No:</strong> ${payment.receiptNo}</p>
          <p><strong>Name:</strong> ${student.name}</p>
          <p><strong>Class:</strong> ${student.className}</p>
          <p><strong>Fee Type:</strong> ${payment.feeType}</p>
          <p><strong>Amount:</strong> ₹${payment.amount}</p>
          <p><strong>Payment Mode:</strong> ${payment.paymentMode}</p>
          <p><strong>Date:</strong> ${new Date(payment.paymentDate).toLocaleDateString()}</p>
        </div>
      </body>
    </html>
  `;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.print();
}
