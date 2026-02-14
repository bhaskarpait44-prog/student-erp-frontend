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

import { SessionView, sessionController } from "../views/session.view.js";
import { loadNavbarSessions } from "../utils/session.js";
import { PromotionView, promotionController } from "../views/promotion.view.js";

import attendanceView from "../views/attendance.view.js";  // ✅ extension added



/* ======================================================
   ROUTES CONFIG
====================================================== */

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

  "/sessions": {
    view: SessionView,
    controller: sessionController,
    protected: true,
  },

  "/promotions": {
    view: PromotionView,
    controller: promotionController,
    protected: true,
  },

  // ✅ Attendance Route (Active Session Based)
  "/attendance": {
    view: () => "",   // render manually
    protected: true,
  },
};



/* ======================================================
   ROUTER FUNCTION
====================================================== */

export const router = () => {

  const fullPath = window.location.hash.replace("#", "") || "/";
  const path = fullPath.split("?")[0];

  const route = routes[path] || routes["/"];

  /* ======================================================
     PROTECTED ROUTES
  ====================================================== */

  if (route.protected) {

    if (!isAuthenticated()) {
      window.location.hash = "#/";
      return;
    }

    // 1️⃣ Render Dashboard Layout
    document.getElementById("app").innerHTML = DashboardView();

    // 2️⃣ Render Page Content
    document.getElementById("pageContent").innerHTML =
      route.view();

    // 3️⃣ Load Navbar Sessions
    setTimeout(() => {
      loadNavbarSessions?.();
    }, 0);

    // 4️⃣ Fee Dropdown Toggle
    const feeBtn = document.getElementById("feeDropdownBtn");
    const feeMenu = document.getElementById("feeDropdownMenu");
    const feeArrow = document.getElementById("feeArrow");

    feeBtn?.addEventListener("click", () => {
      feeMenu?.classList.toggle("hidden");

      if (feeMenu?.classList.contains("hidden")) {
        feeArrow.style.transform = "rotate(0deg)";
      } else {
        feeArrow.style.transform = "rotate(180deg)";
      }
    });

    // 5️⃣ Logout
    document.getElementById("logoutBtn")
      ?.addEventListener("click", () => {
        logout();   // ✅ removed duplicate logout
        sessionStorage.setItem("justLoggedOut", "1");
        window.location.hash = "#/";
      });

    // 6️⃣ Special cases
    if (path === "/student-details") {

      const hash = window.location.hash;
      const queryString = hash.split("?")[1];
      const params = new URLSearchParams(queryString);
      const id = params.get("id");

      studentDetailsController?.(id);

    } 
    else if (path === "/attendance") {

      const hash = window.location.hash;
      const queryString = hash.split("?")[1];
      const params = new URLSearchParams(queryString);

      const studentId = params.get("studentId");

      attendanceView(studentId);   // ✅ only studentId (Active Session based)

    } 
    else {

      route.controller?.();
    }

    return;
  }

  /* ======================================================
     PUBLIC ROUTES
  ====================================================== */

  document.getElementById("app").innerHTML = route.view();
  route.controller?.();
};
