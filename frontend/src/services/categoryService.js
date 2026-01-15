import axiosClient from './axiosClient';

const ENDPOINT = '/Categories';

// Helper to clean params
const cleanParams = (params) => {
    if (!params) return {};
    const newParams = { ...params };
    Object.keys(newParams).forEach(key => {
        if (newParams[key] === null || newParams[key] === undefined || newParams[key] === '') {
            delete newParams[key];
        }
    });
    return newParams;
};

const categoryService = {
    getAll: async (params) => {
        // Không cần .data vì axiosClient đã xử lý
        return await axiosClient.get(ENDPOINT, { params: cleanParams(params) });
    },
    getById: async (id) => {
        return await axiosClient.get(`${ENDPOINT}/${id}`);
    },
    create: async (data) => {
        return await axiosClient.post(ENDPOINT, data);
    },
    update: async (id, data) => {
        return await axiosClient.put(`${ENDPOINT}/${id}`, data);
    },
    remove: async (id) => {
        return await axiosClient.delete(`${ENDPOINT}/${id}`);
    },
    exportCategories: async (params) => {
        return await axiosClient.get(`${ENDPOINT}/export`, { params: cleanParams(params), responseType: 'blob' });
    }
};

export default categoryService;