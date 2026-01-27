import axiosClient from './axiosClient';

const unitService = {
    // Units
    getAll: async (type = null) => {
        const url = type ? `/AdminUnits?type=${type}` : '/AdminUnits';
        return await axiosClient.get(url);
    },
    getHierarchy: async () => {
        return await axiosClient.get('/AdminUnits/hierarchy');
    },
    getById: async (id) => {
        return await axiosClient.get(`/AdminUnits/${id}`);
    },
    create: async (data) => {
        return await axiosClient.post('/AdminUnits', data);
    },
    update: async (id, data) => {
        return await axiosClient.put(`/AdminUnits/${id}`, data);
    },
    delete: async (id) => {
        return await axiosClient.delete(`/AdminUnits/${id}`);
    },

    // Buildings
    getBuildings: async (unitId) => {
        return await axiosClient.get(`/AdminUnits/${unitId}/buildings`);
    },
    addBuilding: async (unitId, data) => {
        return await axiosClient.post(`/AdminUnits/${unitId}/buildings`, data);
    },
    updateBuilding: async (id, data) => {
        return await axiosClient.put(`/AdminUnits/buildings/${id}`, data);
    },
    deleteBuilding: async (id) => {
        return await axiosClient.delete(`/AdminUnits/buildings/${id}`);
    }
};

export default unitService;
