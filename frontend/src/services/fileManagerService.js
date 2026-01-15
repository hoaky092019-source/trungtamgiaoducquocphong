import axiosClient from './axiosClient';

const ENDPOINT = "/FileManager";

const fileManagerService = {
    // Lấy danh sách file/folder
    getNodes: (parentId) => {
        const url = parentId ? `${ENDPOINT}/nodes?parentId=${parentId}` : `${ENDPOINT}/nodes`;
        return axiosClient.get(url);
    },

    // Tạo folder mới
    createFolder: (name, parentId) => {
        return axiosClient.post(`${ENDPOINT}/folder`, { name, parentId });
    },

    // Upload file
    uploadFile: (file, parentId) => {
        const formData = new FormData();
        formData.append('File', file);
        if (parentId) formData.append('ParentId', parentId);

        return axiosClient.post(`${ENDPOINT}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    // Đổi tên
    rename: (id, newName) => {
        return axiosClient.put(`${ENDPOINT}/rename/${id}`, { newName });
    },

    // Xóa
    delete: (id) => {
        return axiosClient.delete(`${ENDPOINT}/${id}`);
    }
};

export default fileManagerService;
