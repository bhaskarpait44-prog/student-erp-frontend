import { request } from "./http.js";

export const feeService = {
  async setFeeStructure(data) {
    return request("/fees/set", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async addPayment(data) {
    return request("/fees/pay", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async getFeeByStudent(studentId) {
    return request(`/fees/${studentId}`);
  },

  async getAllFees() {
  return request("/fees");
},

async getCollectionReport(start, end) {
  return request(`/fees/report/collection?start=${start}&end=${end}`);
},

async getDefaulters() {
  return request("/fees/report/defaulters");
},

deletePayment(data) {
  return request("/fees/payment", {
    method: "DELETE",
    body: JSON.stringify(data),
  });
},



};
