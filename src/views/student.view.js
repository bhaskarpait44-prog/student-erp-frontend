import {
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from "../api/student.service.js";

/* ===============================
   VIEW
================================ */
export function StudentsView() {
  return `
  <div class="space-y-8">

    <!-- HEADER -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold">Students</h1>
        <p class="text-slate-400 text-sm">
          Manage student records
        </p>
      </div>

      <button id="openAddStudent"
        class="bg-blue-600 hover:bg-blue-500 px-5 py-2 rounded-lg shadow transition">
        + Add Student
      </button>
    </div>

    <!-- SEARCH -->
    <div class="bg-slate-800 p-4 rounded-xl border border-slate-700 shadow">
      <input
        id="studentSearch"
        placeholder="Search by name or roll number..."
        class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <!-- GRID -->
    <div id="studentsGrid"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <p class="text-slate-400">Loading...</p>
    </div>

  </div>

  <!-- MODAL -->
  <div id="studentModal"
    class="fixed inset-0 bg-black/70 hidden items-center justify-center z-50">

    <div class="bg-slate-800 w-full max-w-3xl rounded-xl border border-slate-700 shadow-xl">

      <div class="flex justify-between items-center px-6 py-4 border-b border-slate-700">
        <h2 id="modalTitle" class="text-lg font-semibold">Add Student</h2>
        <button id="closeModal" class="text-xl">✕</button>
      </div>

      <div class="p-6">
        <form id="studentForm" class="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input type="hidden" id="studentId" />

          ${Input("Full Name", "name")}
          ${Input("Roll Number", "rollNo")}
          ${Input("Gender", "gender")}
          ${Input("Class", "className")}
          ${Input("Mobile", "mobile")}
          ${Input("Email", "email")}
          ${Input("Father Name", "fatherName")}
          ${Input("Mother Name", "motherName")}
        </form>
      </div>

      <div class="flex justify-end gap-3 px-6 py-4 border-t border-slate-700">
        <button id="cancelModal"
          class="bg-slate-700 px-4 py-2 rounded hover:bg-slate-600 transition">
          Cancel
        </button>

        <button id="saveStudentBtn"
          class="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded transition">
          Save
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
  const modal = document.getElementById("studentModal");
  const saveBtn = document.getElementById("saveStudentBtn");
  const openBtn = document.getElementById("openAddStudent");
  const closeBtn = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelModal");
  const searchInput = document.getElementById("studentSearch");

  let allStudents = [];

  async function loadStudents() {
    allStudents = await getStudents();
    renderStudents(allStudents);
  }

  function renderStudents(students) {
    grid.innerHTML = students.map(studentCard).join("");

    document.querySelectorAll(".viewBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        window.location.hash = `#/student-details?id=${btn.dataset.id}`;
      });
    });

    document.querySelectorAll(".menuBtn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        document.querySelectorAll(".dropdownMenu")
          .forEach(menu => menu.classList.add("hidden"));
        btn.nextElementSibling.classList.toggle("hidden");
      });
    });

    document.addEventListener("click", () => {
      document.querySelectorAll(".dropdownMenu")
        .forEach(menu => menu.classList.add("hidden"));
    });

    document.querySelectorAll(".editBtn").forEach(btn => {
      btn.addEventListener("click", () => {
        const student = JSON.parse(
          decodeURIComponent(btn.dataset.student)
        );
        openEditModal(student);
      });
    });

    document.querySelectorAll(".deleteBtn").forEach(btn => {
      btn.addEventListener("click", async () => {
        if (confirm("Delete this student?")) {
          await deleteStudent(btn.dataset.id);
          await loadStudents();
        }
      });
    });
  }

  await loadStudents();

  /* SEARCH */
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.toLowerCase();
    const filtered = allStudents.filter(s =>
      s.name.toLowerCase().includes(value) ||
      s.rollNo.toLowerCase().includes(value)
    );
    renderStudents(filtered);
  });

  /* OPEN MODAL */
  openBtn.addEventListener("click", () => {
    document.getElementById("modalTitle").innerText = "Add Student";
    document.getElementById("studentForm").reset();
    document.getElementById("studentId").value = "";
    modal.classList.remove("hidden");
    modal.classList.add("flex");
  });

  [closeBtn, cancelBtn].forEach(btn =>
    btn.addEventListener("click", () => {
      modal.classList.add("hidden");
      modal.classList.remove("flex");
    })
  );

  saveBtn.addEventListener("click", async () => {
    const id = document.getElementById("studentId").value;

      const data = {
  name: val("name"),
  rollNo: val("rollNo"),
  gender: val("gender"),
  className: val("className"), 
  mobile: val("mobile"),
  email: val("email"),
  fatherName: val("fatherName"),
  motherName: val("motherName"),
};


    if (id) {
      await updateStudent(id, data);
    } else {
      await createStudent(data);
    }

    modal.classList.add("hidden");
    modal.classList.remove("flex");

    await loadStudents();
  });

  function openEditModal(student) {
    document.getElementById("modalTitle").innerText = "Edit Student";

    document.getElementById("studentId").value = student._id;
    document.getElementById("name").value = student.name || "";
    document.getElementById("rollNo").value = student.rollNo || "";
    document.getElementById("className").value = student.className || "";
    document.getElementById("gender").value = student.gender || "";
    document.getElementById("mobile").value = student.mobile || "";
    document.getElementById("email").value = student.email || "";
    document.getElementById("fatherName").value = student.fatherName || "";
    document.getElementById("motherName").value = student.motherName || "";

    modal.classList.remove("hidden");
    modal.classList.add("flex");
  }

  function val(id) {
    return document.getElementById(id).value;
  }
}

/* ===============================
   CARD
================================ */
function studentCard(s) {
  return `
  <div class="bg-slate-800 border border-slate-700 rounded-2xl p-6 hover:shadow-xl hover:border-blue-500 transition relative">

    <div class="flex justify-between items-start">

      <div class="flex items-center gap-4">

        <div class="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-lg font-semibold">
          ${s.name ? s.name.charAt(0).toUpperCase() : "S"}
        </div>

        <div>
          <h3 class="text-lg font-semibold">
            ${s.name}
          </h3>

          <p class="text-sm text-slate-400">
            Roll No: ${s.rollNo}
          </p>

          <p class="text-sm text-slate-400">
            Class: ${s.className || "-"}
          </p>
        </div>

      </div>

      <div class="relative">
        <button
          class="menuBtn p-2 rounded-lg hover:bg-slate-700 transition">
          ⋮
        </button>

        <div
          class="dropdownMenu hidden absolute right-0 mt-2 w-40 bg-slate-900 border border-slate-700 rounded-lg shadow-lg overflow-hidden">

          <button
            class="viewBtn w-full text-left px-4 py-2 text-sm hover:bg-slate-800"
            data-id="${s._id}">
            👁 View
          </button>

          <button
            class="editBtn w-full text-left px-4 py-2 text-sm hover:bg-slate-800"
            data-student="${encodeURIComponent(JSON.stringify(s))}">
            ✏ Edit
          </button>

          <button
            class="deleteBtn w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800"
            data-id="${s._id}">
            🗑 Delete
          </button>

        </div>
      </div>
    </div>

    <div class="mt-4 border-t border-slate-700 pt-3 space-y-1 text-sm text-slate-400">
      <p>Gender: ${s.gender || "-"}</p>
      <p>Mobile: ${s.mobile || "-"}</p>
      <p>Email: ${s.email || "-"}</p>
    </div>

  </div>
  `;
}

/* ===============================
   INPUT
================================ */
function Input(label, id) {
  return `
    <div>
      <label class="text-sm text-slate-400">${label}</label>
      <input id="${id}"
        class="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500" />
    </div>
  `;
}
