import { login } from "../auth/auth.service.js";
import { setAuth } from "../auth/auth.store.js";
import { navigate } from "../router/router.js";

export const LoginView = () => `
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-6 rounded-lg shadow w-96">
      <h2 class="text-2xl font-bold mb-4 text-center">Login</h2>

      <form id="loginForm" class="space-y-4">
        <input id="username" class="w-full border p-2 rounded" placeholder="Username" required />
        <input id="password" type="password" class="w-full border p-2 rounded" placeholder="Password" required />

        <button class="w-full bg-blue-600 text-white py-2 rounded">
          Login
        </button>
      </form>

      <p class="text-sm text-center mt-4">
        No account?
        <a href="#/signup" class="text-blue-600">Signup</a>
      </p>

      <p id="error" class="text-red-500 text-sm mt-2"></p>
    </div>
  </div>
`;

export const loginController = () => {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const res = await login({
        username: username.value,
        password: password.value,
      });

      setAuth(res.data.token);
      navigate("/dashboard");
    } catch (err) {
      document.getElementById("error").innerText = err.message;
    }
  });
};
