// const API_BASE = "http://localhost:5000/api";

const API_BASE = import.meta.env.VITE_API_BASE;

export const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  });


  
 

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};


