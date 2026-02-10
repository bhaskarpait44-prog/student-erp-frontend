import { signup } from "../auth/auth.service.js";
import { navigate } from "../router/router.js";

export const SignupView = () => `
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow w-96">
      <h2 class="text-2xl font-bold mb-4 text-center">Signup</h2>

      <form id="signupForm" class="space-y-4">
        <input id="username" class="w-full border p-2 rounded" placeholder="Username" required />
        <input id="password" type="password" class="w-full border p-2 rounded" placeholder="Password" required />

        <button class="w-full bg-green-600 text-white py-2 rounded">
          Signup
        </button>
      </form>

      <p class="text-sm text-center mt-4">
        Already have an account?
        <a href="#/" class="text-blue-600">Login</a>
      </p>

      <p id="error" class="text-red-500 text-sm mt-2"></p>
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

      navigate("/");
    } catch (err) {
      document.getElementById("error").innerText = err.message;
    }
  });
};
