import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials:true
})

api.interceptors.response.use((res) => {
    return res
}, (err) => {
    if (err && err?.response?.status === 401) {
        window.location.href ="/Onboarding"
    }   
    return Promise.reject(err);
})