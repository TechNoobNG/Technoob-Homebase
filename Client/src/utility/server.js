import axios from "axios";

const serverBaseURL = process.env.SERVER_BASE_URL || "http://technoobstaging-env.eba-izgw9fe4.eu-west-2.elasticbeanstalk.com";

const serverApi = axios.create({
    baseURL:   `${serverBaseURL}/api/v1/`,
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
