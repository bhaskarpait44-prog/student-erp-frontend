import "./styles/tailwind.css";
import { router } from "./router/router.js";

window.addEventListener("hashchange", router);
window.addEventListener("load", router);
