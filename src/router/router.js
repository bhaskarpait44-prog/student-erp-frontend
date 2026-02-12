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
import { FeeView, feeEvents } from "../views/fee.view.js";
import { FeeStatusView, feeStatusController } from "../views/fee-status.view.js";
import { FeeReportView, feeReportController } from "../views/fee-report.view.js";
import {
  ClassFeeView,
  classFeeController
} from "../views/class-fee.view.js";





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

"/fees": {
  view: FeeView,
  controller: feeEvents,
  protected: true,
},

"/fee-status": {
  view: FeeStatusView,
  controller: feeStatusController,
  protected: true,
},

"/fee-reports": {
  view: FeeReportView,
  controller: feeReportController,
  protected: true,
},

"/class-fee": {
  view: ClassFeeView,
  controller: classFeeController,
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

// 🔥 Fee Dropdown Toggle
setTimeout(() => {
  const btn = document.getElementById("feeDropdownBtn");
  const menu = document.getElementById("feeDropdownMenu");
  const arrow = document.getElementById("feeArrow");

  btn?.addEventListener("click", () => {
    menu.classList.toggle("hidden");

    if (menu.classList.contains("hidden")) {
      arrow.style.transform = "rotate(0deg)";
    } else {
      arrow.style.transform = "rotate(180deg)";
    }
  });
}, 0);



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
