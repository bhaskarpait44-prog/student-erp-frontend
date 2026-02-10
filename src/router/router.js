import { LoginView, loginController } from "../views/login.view.js";
import { SignupView, signupController } from "../views/signup.view.js";
import { logout, isAuthenticated } from "../auth/auth.store.js";

const routes = {
  "/": { view: LoginView, controller: loginController },
  "/signup": { view: SignupView, controller: signupController },

  "/dashboard": {
    view: () => `
      <div class="min-h-screen flex items-center justify-center bg-gray-100">
        <div class="bg-white p-6 rounded-lg shadow w-96 text-center">
          <h1 class="text-2xl font-bold text-green-600 mb-4">
            Dashboard
          </h1>

          <p class="mb-6 text-gray-600">
            You are logged in successfully
          </p>

          <button
            id="logoutBtn"
            class="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    `,
    controller: () => {
      // 🔐 Protect dashboard
      if (!isAuthenticated()) {
        window.location.hash = "#/";
        return;
      }

      document.getElementById("logoutBtn").addEventListener("click", () => {
        logout();
        window.location.hash = "#/";
      });
    },
  },
};

export const navigate = (path) => {
  window.location.hash = `#${path}`;
};

export const router = () => {
  const path = window.location.hash.replace("#", "") || "/";
  const route = routes[path] || routes["/"];

  document.getElementById("app").innerHTML = route.view();
  route.controller && route.controller();
};
