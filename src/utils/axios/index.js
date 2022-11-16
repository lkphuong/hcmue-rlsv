import axios from "axios";

const apiInstance = axios.create({
  // baseURL: process.env.REACT_APP_API_URL,
  baseURL: "http://asset-uat.vtcode.vn:9093/api/",
  timeout: process.env.REACT_APP_API_TIMEOUT,
});

apiInstance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

apiInstance.interceptors.response.use(
  (response) => {
    if (response.status === 205) return console.log("Refetch");

    if (response.data instanceof Blob)
      return { data: response.data, status: response.status };

    return { ...response.data, status: response.status };
  },
  (error) => {
    if (error?.constructor?.name === "Cancel") {
      return error?.message ?? "Cancel";
    }

    if (error?.response?.status === 401) {
      return console.log("Hết hạn token");
    }

    if (error?.response?.status === 403) {
      console.log("Thiếu quyền truy cập");

      return Promise.reject({
        ...error.response.data,
        status: error.response.status,
      });
    }

    return Promise.reject({
      ...error.response.data,
      status: error.response.status,
    });
  }
);

export const setAuthToken = (token) => {
  if (token) {
    apiInstance.defaults.headers["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiInstance.defaults.headers.common["Authorization"];
  }
};

export default apiInstance;
