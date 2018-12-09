import axios from "axios";
import store from "@/store";

export default () => {
  return axios.create({
    baseURL: "http://localhost:3000",
    withCredentials: false,
    headers: {
      Authorization: `Bearer ${store.state.token}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
};
