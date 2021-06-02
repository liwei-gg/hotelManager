import axios from "axios";
var instance = axios.create({
  baseURL: "http://bingjs.com:83",
  timeout: 3000,
});
let get = async function(url, params) {
  let { data } = await instance.get(url, { params });
  return data;
};
let post = async function(url, params) {
  let { data } = await instance.post(url, params);
  return data;
};
instance.interceptors.request.use(
  (config) => {
    // Do something before request is sent

    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);
instance.interceptors.response.use(
  (response) => {
    // Do something before response is sent
    return response;
  },
  (error) => {
    // Do something with response error
    return Promise.reject(error);
  }
);
function setToken() {
  instance.defaults.headers.common["token"] = sessionStorage.getItem("token");
}
export { get, post, setToken };
