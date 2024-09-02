import axios from "axios";

const authAxios = axios.create();

const beforeReq = async (config)=>{


    return config;
}

const requestFail = (err)=>{

}

const beforeRes = async (res)=>{
    return res;
}

const responseFail = (err)=>{

}

authAxios.interceptors.request.use(beforeReq, requestFail);
authAxios.interceptors.response.use(beforeRes, responseFail);


export default authAxios;