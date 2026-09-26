import axios from "axios";

export const server = "https://gadget-mall-1ea03c25d9f8.herokuapp.com/api/v2";

export const backend_url = "https://gadget-mall-1ea03c25d9f8.herokuapp.com/";

export const axiosServerInstance = axios.create({
  baseURL: server,
  withCredentials: true,
});
