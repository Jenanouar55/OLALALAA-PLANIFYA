import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;
const apiClient = axios.create({
  baseURL: apiUrl,
});
export default apiClient;