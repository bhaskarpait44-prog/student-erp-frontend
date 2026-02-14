import { login } from "../auth/auth.service.js";
import { setAuth } from "../auth/auth.store.js";

export const LoginView = () => `
  <div class="min-h-screen flex items-center justify-center
              bg-gradient-to-br from-slate-50 via-white to-indigo-50
              text-slate-800">

    <div class="w-full max-w-md
                bg-white/80 backdrop-blur-2xl
                border border-slate-200
                rounded-3xl
                shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                p-10 transition-all duration-500">

      <!-- Logo / Header -->
      <div class="text-center mb-10">
        <div class="mx-auto mb-4 h-14 w-14
                    rounded-2xl
                    bg-gradient-to-tr from-indigo-600 to-blue-500
                    flex items-center justify-center
                    text-white font-bold text-lg shadow-lg">
          SE
        </div>

        <h1 class="text-2xl font-semibold tracking-tight">
          Welcome Back
        </h1>

        <p class="text-sm text-slate-500 mt-2">
          Sign in to continue to your dashboard
        </p>
      </div>

      <!-- Form -->
      <form id="loginForm" class="space-y-6">

        <div class="space-y-2">
          <label class="text-sm text-slate-500">
            Username
          </label>
          <input
            id="username"
            class="w-full bg-white border border-slate-300
                   rounded-xl px-4 py-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   focus:border-indigo-500
                   transition-all duration-300"
            placeholder="Enter username"
            required
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm text-slate-500">
            Password
          </label>
          <input
            id="password"
            type="password"
            class="w-full bg-white border border-slate-300
                   rounded-xl px-4 py-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-indigo-500
                   focus:border-indigo-500
                   transition-all duration-300"
            placeholder="Enter password"
            required
          />
        </div>

        <!-- Button -->
        <button
          id="loginBtn"
          class="w-full bg-gradient-to-r from-indigo-600 to-blue-500
                 hover:from-indigo-500 hover:to-blue-400
                 transition-all duration-300
                 py-3 rounded-xl font-medium
                 flex items-center justify-center gap-2
                 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]"
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

        <!-- Error -->
        <p
          id="error"
          class="text-center text-sm text-red-500 mt-2">
        </p>

      </form>

      <!-- Footer -->
      <p class="text-center text-sm text-slate-500 mt-8">
        Don’t have an account?
        <a href="#/signup"
           class="text-indigo-600 hover:text-indigo-500 font-medium">
          Sign up
        </a>
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
