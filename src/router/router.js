import { LoginView, loginController } from "../views/login.view.js";
import { SignupView, signupController } from "../views/signup.view.js";
import { DashboardView } from "../views/dashboard.view.js";
import { DashboardHomeView } from "../views/dashboard.home.view.js";
import { StudentsView, studentsController } from "../views/student.view.js";
import {
  StudentDetailsView,
  studentDetailsController
} from "../views/student-details.view.js";
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

  "/student-details": {
  view: StudentDetailsView,
  controller: studentDetailsController,
  protected: true,
},

};

export const router = () => {
  const fullPath = window.location.hash.replace("#", "") || "/";
  const path = fullPath.split("?")[0];

  const route = routes[path] || routes["/"];

  // 🔐 Protected Routes
  if (route.protected) {
    if (!isAuthenticated()) {
      window.location.hash = "#/";
      return;
    }

    document.getElementById("app").innerHTML = DashboardView();
    document.getElementById("pageContent").innerHTML =
      route.view();

    document.getElementById("logoutBtn")
      ?.addEventListener("click", () => {
        logout();
        window.location.hash = "#/";
      });

    // Special case for student details
    if (path === "/student-details") {
      const hash = window.location.hash;
      const queryString = hash.split("?")[1];
      const params = new URLSearchParams(queryString);
      const id = params.get("id");

      studentDetailsController(id);
    } else {
      route.controller?.();
    }

    return;
  }

  // Public
  document.getElementById("app").innerHTML = route.view();
  route.controller?.();
};

