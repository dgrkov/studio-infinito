import axios from 'axios';
import { Cookie } from './Cookie';

export class Axios {
    static instance = null;
    static access_token = '';

    constructor() {
        if (Axios.instance) {
            return Axios.instance;
        }
        Axios.instance = this;
        if (Axios.access_token === '') {
            var cookie = new Cookie();
            var access_token = cookie.getCookie('access_token');
            if (access_token) {
                this.setAccessToken(access_token);
            }
        }else{
            window.location.href = '/';
        }
    }

    // async get(url, body) {
    //     return await axios.get(`${process.env.REACT_APP_API_URL}${url}`, body, {
    //         headers: {
    //             'Authorization': 'Bearer ' + Axios.access_token,
    //         },
    //     });
    // }
    async get(url, body) {
        console.log(`${process.env.REACT_APP_API_URL}${url}`);
        return await axios.get(`${process.env.REACT_APP_API_URL}${url}`, body );
    }

    async post(url, body) {
        return await axios.post(`${process.env.REACT_APP_API_URL}${url}`, body, {
            headers: {
                'Authorization': 'Bearer ' + Axios.access_token,
            },
        });
    }

    async login(url, body) {
        return await axios.post(`${process.env.REACT_APP_API_URL}${url}`, body);
    }

    setAccessToken(token) {
        Axios.access_token = token;
        axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    }

    getAccessToken() {
        return Axios.access_token;
    }
}