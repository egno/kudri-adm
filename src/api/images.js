import axios from 'axios';

export default () => {
  let options = {
    baseURL: process.env.VUE_APP_UPLOAD,
    headers: { 'Content-Type': 'multipart/form-data' }
  };
  if (localStorage.getItem('accessToken')) {
    options.headers.Authorization = `Bearer ${localStorage.getItem(
      'accessToken'
    )}`;
  }
  return axios.create(options);
};
