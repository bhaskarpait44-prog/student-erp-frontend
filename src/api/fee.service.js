import { request } from "./http.js";

export const feeService = {

  /* ================================
     GET FEE BY STUDENT
  ================================= */
  async getFeeByStudent(studentId) {
    return request(`/fees/${studentId}`);
  },

  /* ================================
     ADD PAYMENT
  ================================= */
  async addPayment(data) {
    return request("/fees/payment", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  /* ================================
     DELETE PAYMENT
  ================================= */
  async deletePayment(data) {
    return request("/fees/payment", {
      method: "DELETE",
      body: JSON.stringify(data),
    });
  },

  /* ================================
     FEE STATUS
  ================================= */
  async getFeeStatus(className) {
    return request(`/fees/status/all?className=${className || ""}`);
  },

  /* ================================
     DEFAULTERS REPORT
  ================================= */
  async getDefaulters() {
    return request("/fees/report/defaulters");
  },

  /* ================================
     COLLECTION REPORT
  ================================= */
  async getCollectionReport(start, end) {
    return request(`/fees/report/collection?start=${start}&end=${end}`);
  }

};
