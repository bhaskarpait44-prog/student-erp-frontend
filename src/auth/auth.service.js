import { request } from "../api/http.js";

export const login = (payload) =>
  request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const signup = (payload) =>
  request("/auth/signup", {
    method: "POST",
    body: JSON.stringify(payload),
  });
