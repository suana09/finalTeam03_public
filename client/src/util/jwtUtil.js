import axios from "axios";

const authAxios = axios.create();

const beforeReq = async (config) => {
    const token = sessionStorage.getItem('accessToken');
    config.headers['Authorization'] = 'Bearer ' + token;
    return config;
}

const requestFail = (err) => {
    return Promise.reject(err);
}

const beforeRes = async (res) => {
    return res;
}

const responseFail = (err) => {
    return Promise.reject(err);
}

authAxios.interceptors.request.use(beforeReq, requestFail);
authAxios.interceptors.response.use(beforeRes, responseFail);

export default authAxios;
