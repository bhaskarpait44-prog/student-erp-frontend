import { getStudents, createStudent } from "../api/student.service.js";

/* ===============================
   VIEW
================================ */
export function StudentsView() {
  return `
    <div class="space-y-6">

      <!-- Header -->
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-semibold">Students</h1>

        <button
          id="openAddStudent"
          class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded text-sm">
          + Add Student
        </button>
      </div>

      <!-- Students Grid -->
      <div
        id="studentsGrid"
        class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <p class="text-slate-400">Loading students...</p>
      </div>

    </div>

    <!-- ADD STUDENT MODAL -->
    <div
      id="addStudentModal"
      class="fixed inset-0 bg-black/60 hidden items-center justify-center z-50">

      <div
        class="bg-slate-800 w-full max-w-3xl rounded-xl shadow-xl border border-slate-700">

        <!-- Modal Header -->
        <div
          class="flex justify-between items-center px-6 py-4 border-b border-slate-700">
          <h2 class="text-lg font-semibold">Add Student</h2>
          <button
            id="closeAddStudent"
            class="text-slate-400 hover:text-white text-xl">
            ✕
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 max-h-[70vh] overflow-y-auto">
          <form class="grid grid-cols-1 md:grid-cols-2 gap-4">

            ${Input("Full Name", "text", "name")}
            ${Input("Roll Number", "text", "rollNo")}
            ${Input("Gender", "text", "gender")}
            ${Input("Date of Birth", "date", "dob")}

            ${Input("Mobile Number", "text", "mobileNumber")}
            ${Input("Email Address", "email", "email")}

            ${Input("Father Name", "text", "fatherName")}
            ${Input("Mother Name", "text", "motherName")}

            ${Input("Guardian Name", "text", "guardianName")}
            ${Input("Guardian Phone", "text", "guardianPhone")}

            <div class="md:col-span-2">
              <label class="text-sm text-slate-400">Address</label>
              <textarea
                id="address"
                rows="3"
                class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 mt-1"></textarea>
            </div>

          </form>
        </div>

        <!-- Modal Footer -->
        <div
          class="flex justify-end gap-3 px-6 py-4 border-t border-slate-700">
          <button
            id="cancelAddStudent"
            class="px-4 py-2 text-sm rounded bg-slate-700 hover:bg-slate-600">
            Cancel
          </button>

          <button
            id="saveStudentBtn"
            class="px-4 py-2 text-sm rounded bg-blue-600 hover:bg-blue-500">
            Save Student
          </button>
        </div>

      </div>
    </div>
  `;
}

/* ===============================
   CONTROLLER
================================ */
export async function studentsController() {
  const grid = document.getElementById("studentsGrid");

  // Load students
  try {
    const students = await getStudents();

    grid.innerHTML = students.length
      ? students.map(studentCard).join("")
      : `<p>No students found</p>`;
  } catch {
    grid.innerHTML = `<p class="text-red-400">Failed to load students</p>`;
  }

  // Modal elements
  const modal = document.getElementById("addStudentModal");
  const openBtn = document.getElementById("openAddStudent");
  const closeBtn = document.getElementById("closeAddStudent");
  const cancelBtn = document.getElementById("cancelAddStudent");
  const saveBtn = document.getElementById("saveStudentBtn");

  // Open modal
  openBtn?.addEventListener("click", () => {
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  });

  // Close modal
  [closeBtn, cancelBtn].forEach(btn =>
    btn?.addEventListener("click", () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    })
  );

  // ✅ SAVE STUDENT (IMPORTANT)
  saveBtn?.addEventListener("click", async () => {
    const studentData = {
      name: document.getElementById("name").value,
      rollNo: document.getElementById("rollNo").value,
      gender: document.getElementById("gender").value,
      dob: document.getElementById("dob").value,
      mobile: document.getElementById("mobileNumber").value,
      email: document.getElementById("email").value,
      fatherName: document.getElementById("fatherName").value,
      motherName: document.getElementById("motherName").value,
      guardianName: document.getElementById("guardianName").value,
      guardianPhone: document.getElementById("guardianPhone").value,
      address: document.getElementById("address").value,
    };

    try {
      await createStudent(studentData);

      // Close modal
      modal.classList.add("hidden");
      modal.classList.remove("flex");

      // Reload grid
      const students = await getStudents();
      grid.innerHTML = students.map(studentCard).join("");
    } catch (err) {
      alert(err.message || "Failed to save student");
    }
  });
}

/* ===============================
   STUDENT CARD (UNCHANGED)
================================ */
function studentCard(s) {
  return `
    <div class="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-2">
      <h3 class="font-semibold text-lg">${s.name}</h3>

      <p class="text-sm text-slate-400">
        Roll No: ${s.rollNo}
      </p>

      <p class="text-sm text-slate-400">
        Gender: ${s.gender}
      </p>

      <p class="text-sm text-slate-400">
        Phone: ${s.mobileNumber || "-"}
      </p>
    </div>
  `;
}

/* ===============================
   INPUT HELPER
================================ */
function Input(label, type = "text", id = "") {
  return `
    <div>
      <label class="text-sm text-slate-400">${label}</label>
      <input
        id="${id}"
        type="${type}"
        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 mt-1"
      />
    </div>
  `;
}
