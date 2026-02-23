import { useAuth } from "@clerk/clerk-expo";
import axios from "axios";
import { useEffect } from "react";

// For debugging: use local backend (emulator: localhost, device: your PC IP e.g. http://192.168.1.5:3000/api)
//const API_URL = "http://192.168.0.6:3000/api";

// prod url will work in your physical device
const API_URL = "https://expo-ecommerce-hbwn5.sevalla.app/api"

const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

export const useApi = () => {
    const { getToken } = useAuth();

    useEffect(() => {
        const interceptor = api.interceptors.request.use(async (config) => {
            const token = await getToken();

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        });

        // cleanup: remove interceptor when component unmounts

        return () => {
            api.interceptors.request.eject(interceptor);
        };
    }, [getToken]);

    return api;
};
