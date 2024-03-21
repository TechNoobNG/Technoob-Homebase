import axios from "axios";

const testBaseUrl = "staging-api.technoob.tech"
const prodBaseUrl = "api.technoob.tech"
const serverApi = axios.create({
    baseURL: `https://${prodBaseUrl}/api/v1/`,
    withCredentials: true,
});

serverApi.defaults.headers.common["Content-Type"] = "application/json";

serverApi.requiresAuth = function (requiresToken){
    if(requiresToken){
        const userToken = sessionStorage.getItem('user_token');
        serverApi.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
        return null
    }

    return null

}
export default serverApi
