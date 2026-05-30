import axios from "axios";

const API = axios.create({
  baseURL: "https://health-net-8pna.onrender.com",
});

// ================= TOKEN ATTACH =================
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ================= ERROR LOGGER =================
API.interceptors.response.use(
  (res) => res,
  (err) => {
    console.log("API ERROR:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default API;