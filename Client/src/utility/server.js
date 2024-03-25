import axios from "axios";

const testBaseUrl = "staging-api.technoob.tech";
const prodBaseUrl = "api.technoob.tech";
const serverApi = axios.create({
  baseURL: `https://${testBaseUrl}/api/v1/`,
  withCredentials: true,
});

serverApi.defaults.headers.common["Content-Type"] = "application/json";

serverApi.requiresAuth = function (requiresAuth) {
  if (requiresAuth) {
    const userToken = sessionStorage.getItem("user_token");
    serverApi.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
    serverApi.defaults.withCredentials = true;
    return null;
  }

  return null;
};
export default serverApi;
