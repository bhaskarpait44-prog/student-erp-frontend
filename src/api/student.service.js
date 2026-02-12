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

export const deleteStudent = (id) =>
  request(`/students/${id}`, {
    method: "DELETE",
  });


export const updateStudent = (id, data) =>
  request(`/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  export const getStudentById = (id) =>
  request(`/students/${id}`);