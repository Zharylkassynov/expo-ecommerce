import axiosInstance from "./axios.js";
import {data} from "react-router";

export const productApi = {
    getAll: async () => {
        const {data} = axiosInstance.get("/admin/products");
        return data;
    },

    create: async (formData) => {
        const {data} = axiosInstance.post("/admin/products", formData);
        return data;
    },

    update: async (id, formData) => {
        const {data} = axiosInstance.put(`/admin/products/${id}`, formData);
        return data;
    },

};

export const orderApi = {
    getAll: async () => {
        const {data} = axiosInstance.get("/admin/orders");
        return data;
    },

    updateStatus: async (orderId, status) => {
        const {data} = axiosInstance.patch(`/admin/orders/${orderId}/status`, {status});
        return data;
    },
}

export const statsApi = {
    getDashboard: async () => {
        const {data} = axiosInstance.get("/admin/stats");
        return data;
    }
}