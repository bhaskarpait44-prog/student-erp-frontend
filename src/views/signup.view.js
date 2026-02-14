import { signup } from "../auth/auth.service.js";


export const SignupView = () => `
  <div class="min-h-screen flex items-center justify-center
              bg-gradient-to-br from-slate-50 via-white to-emerald-50
              text-slate-800">

    <div class="w-full max-w-md
                bg-white/80 backdrop-blur-2xl
                border border-slate-200
                rounded-3xl
                shadow-[0_20px_60px_rgba(0,0,0,0.08)]
                p-10 transition-all duration-500">

      <!-- Header -->
      <div class="text-center mb-10">
        <div class="mx-auto mb-4 h-14 w-14
                    rounded-2xl
                    bg-gradient-to-tr from-emerald-600 to-green-500
                    flex items-center justify-center
                    text-white font-bold text-lg shadow-lg">
          SE
        </div>

        <h2 class="text-2xl font-semibold tracking-tight">
          Create Account
        </h2>

        <p class="text-sm text-slate-500 mt-2">
          Sign up to start using the dashboard
        </p>
      </div>

      <!-- Form -->
      <form id="signupForm" class="space-y-6">

        <div class="space-y-2">
          <label class="text-sm text-slate-500">
            Username
          </label>
          <input
            id="username"
            class="w-full bg-white border border-slate-300
                   rounded-xl px-4 py-3 text-sm
                   focus:outline-none focus:ring-2 focus:ring-emerald-500
                   focus:border-emerald-500
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
                   focus:outline-none focus:ring-2 focus:ring-emerald-500
                   focus:border-emerald-500
                   transition-all duration-300"
            placeholder="Enter password"
            required
          />
        </div>

        <button
          class="w-full bg-gradient-to-r from-emerald-600 to-green-500
                 hover:from-emerald-500 hover:to-green-400
                 transition-all duration-300
                 py-3 rounded-xl font-medium
                 text-white shadow-lg hover:shadow-xl hover:scale-[1.02]">
          Create Account
        </button>

        <p id="error"
           class="text-center text-sm text-red-500 mt-2">
        </p>

      </form>

      <!-- Footer -->
      <p class="text-center text-sm text-slate-500 mt-8">
        Already have an account?
        <a href="#/"
           class="text-emerald-600 hover:text-emerald-500 font-medium">
          Login
        </a>
      </p>

    </div>
  </div>
`;


export const signupController = () => {
  document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      await signup({
        username: username.value,
        password: password.value,
      });

      window.location.hash = "#/";
    } catch (err) {
      document.getElementById("error").innerText = err.message;
    }
  });
};
