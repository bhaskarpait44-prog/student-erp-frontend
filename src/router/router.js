import { LoginView, loginController } from "../views/login.view.js";
import { SignupView, signupController } from "../views/signup.view.js";

import { DashboardView } from "../views/dashboard.view.js";
import { DashboardHomeView } from "../views/dashboard.home.view.js";

import { StudentsView, studentsController } from "../views/student.view.js";

import { logout, isAuthenticated } from "../auth/auth.store.js";

const routes = {
  "/": { view: LoginView, controller: loginController },
  "/signup": { view: SignupView, controller: signupController },

  "/dashboard": {
    view: DashboardHomeView,
    protected: true,
  },

  "/students": {
    view: StudentsView,
    controller: studentsController,
    protected: true,
  },
};

export const router = () => {
  const path = window.location.hash.replace("#", "") || "/";

  // 🔐 Protected layout routes
  if (path === "/dashboard" || path === "/students") {
    if (!isAuthenticated()) {
      window.location.hash = "#/";
      return;
    }

    // Load shell layout
    document.getElementById("app").innerHTML = DashboardView();

    // Load page content
    document.getElementById("pageContent").innerHTML =
      routes[path].view();

    // Logout handler
    document.getElementById("logoutBtn")
      ?.addEventListener("click", () => {
        logout();
        window.location.hash = "#/";
      });

    // Optional controller
    routes[path].controller?.();
    return;
  }

  // Public routes
  const route = routes[path] || routes["/"];
  document.getElementById("app").innerHTML = route.view();
  route.controller?.();
};
