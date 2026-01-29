import axiosInstance from "./axios";

export const productApi = {
    getAll: async () => {
        try {
            const {data} = await axiosInstance.get("/admin/products");
            return Array.isArray(data) ? data : [];
        } catch (error) {
            console.error("Error fetching products:", error);
            return [];
        }
    },

    create: async (formData) => {
        const {data} = await axiosInstance.post("/admin/products", formData);
        return data;
    },

    update: async ({id, formData}) => {
        const {data} = await axiosInstance.put(`/admin/products/${id}`, formData);
        return data;
    },

    delete: async (productId) => {
        const {data} = await axiosInstance.delete(`/admin/products/${productId}`);
        return data;
    },
};

export const orderApi = {
    getAll: async () => {
        try {
            const {data} = await axiosInstance.get("/admin/orders");
            return data || {};
        } catch (error) {
            console.error("Error fetching orders:", error);
            return {orders: []};
        }
    },

    updateStatus: async ({orderId, status}) => {
        const {data} = await axiosInstance.patch(`/admin/orders/${orderId}/status`, {status});
        return data;
    },
};

export const statsApi = {
    getDashboard: async () => {
        const {data} = await axiosInstance.get("/admin/stats");
        return data;
    },
};