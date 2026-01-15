import axiosClient from './axiosClient';

const ENDPOINT = '/Faculties';

// Helper
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

const getAll = async (params) => {
    return await axiosClient.get(ENDPOINT, { params: cleanParams(params) });
};

const getById = async (id) => {
    return await axiosClient.get(`${ENDPOINT}/${id}`);
};

const create = async (data) => {
    return await axiosClient.post(ENDPOINT, data);
};

const update = async (id, data) => {
    return await axiosClient.put(`${ENDPOINT}/${id}`, data);
};

const remove = async (id) => {
    return await axiosClient.delete(`${ENDPOINT}/${id}`);
};

const exportFaculties = async (params) => {
    return await axiosClient.get(`${ENDPOINT}/export`, { params: cleanParams(params), responseType: 'blob' });
};

const facultyService = { getAll, getById, create, update, remove, exportFaculties };
export default facultyService;