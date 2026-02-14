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
  <div class="space-y-10">

    <!-- HEADER -->
    <div class="flex justify-between items-center">

      <div>
        <h1 class="text-3xl font-semibold tracking-tight text-white">
          Students
        </h1>
        <p class="text-slate-400 text-sm mt-1">
          Manage and monitor student records
        </p>
      </div>

      <button id="openAddStudent"
        class="bg-gradient-to-r from-indigo-600 to-blue-500
               hover:from-indigo-500 hover:to-blue-400
               px-6 py-2.5 rounded-xl shadow-xl
               text-sm font-medium tracking-wide
               transition-all duration-300 hover:scale-105">
        + Add Student
      </button>

    </div>

    <!-- SEARCH -->
    <div class="bg-slate-900/60 backdrop-blur-xl
                p-6 rounded-2xl border border-slate-800
                shadow-[0_10px_40px_rgba(0,0,0,0.6)]">

      <input
        id="studentSearch"
        placeholder="Search by name or roll number..."
        class="w-full bg-slate-950 border border-slate-800
               rounded-xl px-5 py-3 text-sm
               focus:outline-none focus:ring-2 focus:ring-indigo-500
               transition-all duration-300"
      />

    </div>

    <!-- GRID -->
    <div id="studentsGrid"
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <p class="text-slate-400">Loading...</p>
    </div>

  </div>

  ${studentModal()}
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
      s.name?.toLowerCase().includes(value) ||
      s.rollNo?.toLowerCase().includes(value)
    );
    renderStudents(filtered);
  });

  /* MODAL OPEN */
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
   MODAL
================================ */
function studentModal() {
  return `
  <div id="studentModal"
    class="fixed inset-0 bg-black/80 backdrop-blur-sm hidden items-center justify-center z-50">

    <div class="bg-slate-900/95 backdrop-blur-2xl
                w-full max-w-4xl rounded-3xl
                border border-slate-800
                shadow-[0_30px_80px_rgba(0,0,0,0.8)]">

      <div class="flex justify-between items-center px-8 py-6 border-b border-slate-800">
        <h2 id="modalTitle" class="text-xl font-semibold text-white">
          Add Student
        </h2>
        <button id="closeModal"
          class="h-10 w-10 flex items-center justify-center
                 rounded-full hover:bg-slate-800 text-lg">✕</button>
      </div>

      <div class="p-8">
        <form id="studentForm"
          class="grid grid-cols-1 md:grid-cols-2 gap-6">

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

      <div class="flex justify-end gap-4 px-8 py-6 border-t border-slate-800">
        <button id="cancelModal"
          class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700">
          Cancel
        </button>
        <button id="saveStudentBtn"
          class="px-6 py-2.5 rounded-xl
                 bg-gradient-to-r from-indigo-600 to-blue-500
                 hover:from-indigo-500 hover:to-blue-400 shadow-lg">
          Save Student
        </button>
      </div>

    </div>
  </div>
  `;
}

/* ===============================
   CARD (Modern SaaS Version)
================================ */
function studentCard(s) {
  return `
  <div class="group relative bg-slate-900/70 backdrop-blur-xl
              border border-slate-800 rounded-2xl p-6
              shadow-[0_10px_40px_rgba(0,0,0,0.6)]
              transition-all duration-300
              hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,0,0,0.8)]
              hover:border-indigo-500/40 overflow-hidden">

    <div class="absolute inset-0 opacity-0 group-hover:opacity-100
                transition duration-500
                bg-gradient-to-tr from-indigo-500/10 via-transparent to-cyan-500/10"></div>

    <div class="relative z-10">

      <div class="flex justify-between items-start">

        <div class="flex items-center gap-4">

          <div class="h-14 w-14 rounded-full
                      bg-gradient-to-tr from-indigo-500 to-cyan-400
                      flex items-center justify-center
                      text-lg font-semibold text-white shadow-lg">
            ${s.name ? s.name.charAt(0).toUpperCase() : "S"}
          </div>

          <div>
            <h3 class="text-lg font-semibold text-white">
              ${s.name}
            </h3>
            <p class="text-xs text-slate-400">
              Roll No: ${s.rollNo}
            </p>
            <p class="text-xs text-slate-400">
              Class: ${s.className || "-"}
            </p>
          </div>

        </div>

        <div class="relative">
          <button class="menuBtn p-2 rounded-lg hover:bg-slate-800">
            ⋮
          </button>

          <div class="dropdownMenu hidden absolute right-0 mt-2 w-40
                      bg-slate-900/95 backdrop-blur-xl
                      border border-slate-800
                      rounded-xl shadow-xl overflow-hidden">

            <button class="viewBtn w-full text-left px-4 py-2 text-sm hover:bg-slate-800"
              data-id="${s._id}">
              👁 View
            </button>

            <button class="editBtn w-full text-left px-4 py-2 text-sm hover:bg-slate-800"
              data-student="${encodeURIComponent(JSON.stringify(s))}">
              ✏ Edit
            </button>

            <button class="deleteBtn w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800"
              data-id="${s._id}">
              🗑 Delete
            </button>

          </div>
        </div>

      </div>

      <div class="mt-5 border-t border-slate-800 pt-4 space-y-1 text-sm text-slate-400">
        <p>Gender: ${s.gender || "-"}</p>
        <p>Mobile: ${s.mobile || "-"}</p>
        <p>Email: ${s.email || "-"}</p>
      </div>

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
        class="w-full bg-slate-950 border border-slate-800
               rounded-xl px-4 py-2 mt-2
               focus:outline-none focus:ring-2 focus:ring-indigo-500" />
    </div>
  `;
}
