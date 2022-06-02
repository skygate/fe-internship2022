import axios from "axios";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

const axiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        //prettier-ignore
        "Accept": "application/json",
        "Access-Control-Allow-Origin": "http://localhost:3000/",
    },
});

export default axiosInstance;
