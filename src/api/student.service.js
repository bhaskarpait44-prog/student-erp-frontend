import { request } from "./http.js";

export const getStudents = async () => {
  return request("/students");
};


export const createStudent = (data) => {
  return request("/students", {
    method: "POST",
    body: JSON.stringify(data),
  });
};