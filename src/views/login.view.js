import { login } from "../auth/auth.service.js";
import { setAuth } from "../auth/auth.store.js";

export const LoginView = () => `
  <div class="min-h-screen flex items-center justify-center bg-slate-900 text-slate-200">

    <div class="w-full max-w-md bg-slate-800 border border-slate-700 rounded-2xl shadow-xl p-8">
      
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold text-blue-400">Student ERP</h1>
        <p class="text-sm text-slate-400 mt-2">
          Sign in to your admin account
        </p>
      </div>

      <!-- Form -->
      <form id="loginForm" class="space-y-5">

        <div>
          <label class="block text-sm mb-1 text-slate-400">
            Username
          </label>
          <input
            id="username"
            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter username"
            required
          />
        </div>

        <div>
          <label class="block text-sm mb-1 text-slate-400">
            Password
          </label>
          <input
            id="password"
            type="password"
            class="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
            required
          />
        </div>

        <button
  id="loginBtn"
  class="w-full bg-blue-600 hover:bg-blue-500 transition py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2"
>
  <span id="btnText">Login</span>

  <!-- Spinner -->
  <svg
    id="btnLoader"
    class="hidden w-5 h-5 animate-spin"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      class="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      stroke-width="4"
    ></circle>
    <path
      class="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    ></path>
  </svg>
</button>


      <!-- Footer -->
      <p class="text-center text-sm text-slate-400 mt-6">
        Don’t have an account?
        <a href="#/signup" class="text-blue-400 hover:underline">
          Sign up
        </a>
      </p>

      <p
        id="error"
        class="text-center text-sm text-red-400 mt-4">
      </p>
    </div>
  </div>
`;


export const loginController = () => {
  const form = document.getElementById("loginForm");
  const errorEl = document.getElementById("error");
  const loginBtn = document.getElementById("loginBtn");
  const btnText = document.getElementById("btnText");
  const btnLoader = document.getElementById("btnLoader");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    errorEl.innerText = "";

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      // ✅ Start Loading
      loginBtn.disabled = true;
      btnText.innerText = "Logging in...";
      btnLoader.classList.remove("hidden");

      const res = await login({ username, password });

      setAuth(res.data.token);

      window.location.hash = "#/dashboard";

    } catch (err) {
      errorEl.innerText = err.message || "Login failed";
    } finally {
      // ✅ Stop Loading
      loginBtn.disabled = false;
      btnText.innerText = "Login";
      btnLoader.classList.add("hidden");
    }
  });
};
