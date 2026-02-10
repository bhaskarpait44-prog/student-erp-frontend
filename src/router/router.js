import { LoginView, loginController } from "../views/login.view.js";
import { SignupView, signupController } from "../views/signup.view.js";
import { DashboardView } from "../views/dashboard.view.js";
import { isAuthenticated, logout } from "../auth/auth.store.js";

const routes = {
  "/": {
    view: LoginView,
    controller: loginController,
  },

  "/signup": {
    view: SignupView,
    controller: signupController,
  },

  "/dashboard": {
    view: DashboardView,
    controller: () => {
      // 🔐 Protect dashboard
      if (!isAuthenticated()) {
        window.location.hash = "#/";
        return;
      }

      // 🚪 Logout logic
      const logoutBtn = document.getElementById("logoutBtn");
      if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
          logout();
          window.location.hash = "#/";
        });
      }
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
