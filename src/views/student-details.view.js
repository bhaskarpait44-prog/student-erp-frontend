import {
  getStudentById,
  updateStudent
} from "../api/student.service.js";

/* ===============================
   VIEW
================================ */
export function StudentDetailsView() {
  return `
  <div class="space-y-8">

    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-2xl font-bold">Student Profile</h1>
        <p class="text-sm text-slate-400">
          Dashboard / Students / Profile
        </p>
      </div>

      <div class="flex gap-3">
        <button id="editProfileBtn"
          class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm">
          ✏ Edit
        </button>

        <button id="backBtn"
          class="bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg text-sm">
          ← Back
        </button>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- LEFT PROFILE CARD -->
      <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 space-y-6 shadow-lg">

        <div class="flex flex-col items-center text-center space-y-3">
          <div id="profileLetter"
            class="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-3xl font-bold shadow-lg">
            S
          </div>

          <div>
            <h2 id="studentName" class="text-xl font-semibold">Loading...</h2>
            <p id="studentRoll" class="text-sm text-slate-400"></p>
          </div>
        </div>

        <div class="space-y-4 text-sm">
          ${infoRow("Gender", "studentGender")}
          ${infoRow("Mobile", "studentMobile")}
          ${infoRow("Email", "studentEmail")}
          ${infoRow("Father", "studentFather")}
          ${infoRow("Mother", "studentMother")}
        </div>

      </div>

      <!-- RIGHT -->
      <div class="lg:col-span-2 space-y-6">
        <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 shadow-lg">

          <h3 class="text-lg font-semibold mb-6">Basic Information</h3>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            ${detailField("Roll Number", "infoRoll")}
            ${detailField("Gender", "infoGender")}
            ${detailField("Email", "infoEmail")}
            ${detailField("Mobile", "infoMobile")}
          </div>

        </div>
      </div>

    </div>

    <!-- EDIT MODAL -->
    <div id="editModal"
      class="fixed inset-0 bg-black/70 hidden items-center justify-center z-50">

      <div class="bg-slate-800 w-full max-w-3xl rounded-xl border border-slate-700">

        <div class="flex justify-between items-center px-6 py-4 border-b border-slate-700">
          <h2 class="text-lg font-semibold">Edit Student</h2>
          <button id="closeEditModal" class="text-xl">✕</button>
        </div>

        <div class="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">

          <input type="hidden" id="editId" />

          ${inputField("Full Name", "editName")}
          ${inputField("Roll Number", "editRollNo")}
          ${inputField("Gender", "editGender")}
          ${inputField("Mobile", "editMobile")}
          ${inputField("Email", "editEmail")}
          ${inputField("Father Name", "editFather")}
          ${inputField("Mother Name", "editMother")}

        </div>

        <div class="flex justify-end gap-3 px-6 py-4 border-t border-slate-700">
          <button id="cancelEdit"
            class="bg-slate-700 px-4 py-2 rounded">
            Cancel
          </button>

          <button id="saveEdit"
            class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded">
            Save Changes
          </button>
        </div>

      </div>
    </div>

  </div>
  `;
}

/* ===============================
   CONTROLLER
================================ */
export async function studentDetailsController(id) {
  if (!id) return;

  const student = await getStudentById(id);
  if (!student) return;

  // Fill profile
  document.getElementById("profileLetter").innerText =
    student.name?.charAt(0).toUpperCase() || "S";

  document.getElementById("studentName").innerText =
    student.name || "-";

  document.getElementById("studentRoll").innerText =
    "Roll No: " + (student.rollNo || "-");

  document.getElementById("studentGender").innerText =
    student.gender || "-";

  document.getElementById("studentMobile").innerText =
    student.mobile || "-";

  document.getElementById("studentEmail").innerText =
    student.email || "-";

  document.getElementById("studentFather").innerText =
    student.fatherName || "-";

  document.getElementById("studentMother").innerText =
    student.motherName || "-";

  document.getElementById("infoRoll").innerText =
    student.rollNo || "-";

  document.getElementById("infoGender").innerText =
    student.gender || "-";

  document.getElementById("infoEmail").innerText =
    student.email || "-";

  document.getElementById("infoMobile").innerText =
    student.mobile || "-";

  document.getElementById("backBtn")
    .addEventListener("click", () => {
      window.location.hash = "#/students";
    });

  // ===== EDIT MODAL LOGIC =====

  const modal = document.getElementById("editModal");

  document.getElementById("editProfileBtn")
    .addEventListener("click", () => {

      document.getElementById("editId").value = student._id;
      document.getElementById("editName").value = student.name || "";
      document.getElementById("editRollNo").value = student.rollNo || "";
      document.getElementById("editGender").value = student.gender || "";
      document.getElementById("editMobile").value = student.mobile || "";
      document.getElementById("editEmail").value = student.email || "";
      document.getElementById("editFather").value = student.fatherName || "";
      document.getElementById("editMother").value = student.motherName || "";

      modal.classList.remove("hidden");
      modal.classList.add("flex");
    });

  document.getElementById("closeEditModal")
    .addEventListener("click", closeModal);

  document.getElementById("cancelEdit")
    .addEventListener("click", closeModal);

  function closeModal() {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }

  document.getElementById("saveEdit")
    .addEventListener("click", async () => {

      const updatedData = {
        name: val("editName"),
        rollNo: val("editRollNo"),
        gender: val("editGender"),
        mobile: val("editMobile"),
        email: val("editEmail"),
        fatherName: val("editFather"),
        motherName: val("editMother"),
      };

      await updateStudent(student._id, updatedData);

      closeModal();

      // Reload profile
      studentDetailsController(student._id);
    });

  function val(id) {
    return document.getElementById(id).value;
  }
}

/* ===============================
   HELPERS
================================ */
function infoRow(label, id) {
  return `
    <div class="flex justify-between border-b border-slate-700 pb-2">
      <span class="text-slate-400">${label}</span>
      <span id="${id}" class="text-white"></span>
    </div>
  `;
}

function detailField(label, id) {
  return `
    <div>
      <label class="text-slate-400 block mb-1">${label}</label>
      <p id="${id}" class="text-white font-medium"></p>
    </div>
  `;
}

function inputField(label, id) {
  return `
    <div>
      <label class="text-sm text-slate-400">${label}</label>
      <input id="${id}"
        class="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 mt-1" />
    </div>
  `;
}
