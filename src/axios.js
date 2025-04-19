import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default instance;
