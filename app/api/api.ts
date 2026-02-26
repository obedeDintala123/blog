import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
});

api.interceptors.request.use(async (config) => {
  const token = Cookies.get("token");

  config.headers["Content-Type"] = "application/json";

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }

  return config;
});

export { api };
