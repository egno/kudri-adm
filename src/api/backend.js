import axios from "axios";

export default () => {
  return axios.create({
    baseURL: "http://localhost:3001",
    withCredentials: false,
    headers: {
      Authorization: `Bearer ${window.localStorage.accessToken}`,
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });
};
