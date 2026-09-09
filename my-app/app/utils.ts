import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials:true
})

api.interceptors.response.use((res) => {
    return res
}, async (err) => {
    
    const config = err.config   
    
        if (err && err?.response?.status === 401) {
        window.location.href = "/Onboarding"
        
    return Promise.reject(err);
    }   
    if (!config) {
        
    return Promise.reject(err);
        
    }
    config._retryCount = config._retryCount || 0
    if (config._retryCount >= 2) {
        return Promise.reject(err)
    }
    config._retryCount++
    const Controller = new AbortController()
    config.signal = Controller.signal
    const timeout=setTimeout(() => {
        Controller.abort()
    }, 5000);
    try {
        return await api(config)
    } finally {
        clearTimeout(timeout)
    }
})
