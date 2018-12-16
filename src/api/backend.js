import axios from 'axios';

export default () => {
  let options = {
    baseURL: process.env.VUE_APP_API,
    withCredentials: false,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    }
  };
  if (localStorage.getItem('accessToken')) {
    options.headers.Authorization = `Bearer ${localStorage.getItem(
      'accessToken'
    )}`;
  }
  console.log('API:', options.baseURL);
  return axios.create(options);
};
