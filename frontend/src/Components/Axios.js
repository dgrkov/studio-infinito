import axios from "axios";
import { Cookie } from "./Cookie";

export class Axios {
    static instance = null;
    static access_token = "";

    constructor() {
        if (Axios.instance) {
            return Axios.instance;
        }
        Axios.instance = this;

        const cookie = new Cookie();
        const token = cookie.getCookie("access_token");

        if (token) {
            this.setAccessToken(token);
        } else {
            console.warn("No access token found in cookies!");
        }

        // Add request interceptor once in constructor
        axios.interceptors.request.use(
            (config) => {
                if (Axios.access_token) {
                    config.headers["Authorization"] = `Bearer ${Axios.access_token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    setAccessToken(token) {
        Axios.access_token = token; // ✅ Store the token correctly
    }

    async get(url, params = {}) {
        console.log("Access token used:", Axios.access_token);
        return axios.get(`${process.env.REACT_APP_API_URL}${url}`, { params });
    }

    async post(url, body) {
        return axios.post(`${process.env.REACT_APP_API_URL}${url}`, body);
    }

    async login(url, body) {
        return await axios.post(`${process.env.REACT_APP_API_URL}${url}`, body);
    }

    getAccessToken() {
        return Axios.access_token;
    }
}

export default Axios;