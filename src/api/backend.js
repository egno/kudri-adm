import axios from "axios";

export default () => {
  let options = {
    baseURL: "/api/v1/",
    withCredentials: false,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  };
  if (localStorage.getItem("accessToken")) {
    options.headers.Authorization = `Bearer ${localStorage.getItem(
      "accessToken"
    )}`;
  }
  return axios.create(options);
};
