import { request } from "../api/http.js";

export async function loadNavbarSessions() {

  const btn = document.getElementById("sessionBtn");
  const text = document.getElementById("sessionText");
  const menu = document.getElementById("sessionMenu");
  const arrow = document.getElementById("sessionArrow");

  if (!btn || !text || !menu) return;

  try {

    const sessions = await request("/sessions");

    if (!Array.isArray(sessions)) {
      text.innerText = "No Session";
      return;
    }

    const active = sessions.find(s => s.isActive);

    text.innerText = active ? active.name : "Select Session";

    menu.innerHTML = sessions.map(s => `
      <button
        class="block w-full text-left px-4 py-2 hover:bg-slate-800 text-sm
        ${s.isActive ? "text-green-400 font-semibold" : ""}"
        data-id="${s._id}">
        ${s.name}
        ${s.isActive ? "(Active)" : ""}
      </button>
    `).join("");

    // Toggle dropdown
    btn.onclick = () => {
      menu.classList.toggle("hidden");
      arrow.style.transform =
        menu.classList.contains("hidden")
          ? "rotate(0deg)"
          : "rotate(180deg)";
    };

    // Activate session
    document.querySelectorAll("#sessionMenu button")
      .forEach(button => {
        button.addEventListener("click", async () => {

          await request(`/sessions/activate/${button.dataset.id}`, {
            method: "PUT"
          });

          location.reload();
        });
      });

  } catch (err) {
    console.error("Session load error:", err);
    text.innerText = "Session Error";
  }
}
