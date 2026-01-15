import axiosClient from './axiosClient';

const ENDPOINT = "/Posts";
// Định nghĩa endpoint upload ảnh (trùng với Controller bạn viết trong .NET)
const UPLOAD_ENDPOINT = "/upload/image-ck4";

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

const postService = {
    getAll: (params = { isPublic: false }) => axiosClient.get(ENDPOINT, { params: cleanParams(params) }),

    getById: (id) => axiosClient.get(`${ENDPOINT}/${id}`),

    create: (data) => axiosClient.post(ENDPOINT, data),

    update: (id, data) => axiosClient.put(`${ENDPOINT}/${id}`, data),

    // Lấy bài viết theo Slug
    getBySlug: (slug) => axiosClient.get(`${ENDPOINT}/slug/${slug}`),

    // Lấy bài viết theo Category Slug (Công khai, có phân trang)
    getByCategorySlug: (slug, page = 1, limit = 5) => axiosClient.get(`${ENDPOINT}/public/category/${slug}`, {
        params: { page, limit }
    }),

    remove: (id) => axiosClient.delete(`${ENDPOINT}/${id}`),

    exportPosts: (params) => axiosClient.get(`${ENDPOINT}/export`, { params: cleanParams(params), responseType: 'blob' }),

    approve: (id, comment) => axiosClient.post(`${ENDPOINT}/${id}/approve`, { comment }),

    reject: (id, comment) => axiosClient.post(`${ENDPOINT}/${id}/reject`, { comment }),

    /**
     * Hàm helper để sinh ra URL upload ảnh cho CKEditor 4
     * Tự động nối Domain API + Endpoint Upload + Token
     */
    getCkEditorUploadUrl: () => {
        // 1. Lấy Base URL từ cấu hình axios (VD: http://localhost:5076/api)
        const baseUrl = axiosClient.defaults.baseURL;

        // 2. Lấy token thủ công (Vì CKEditor không đi qua Interceptor của axios)
        const userStr = localStorage.getItem('user');
        const token = userStr ? JSON.parse(userStr).token : '';

        // 3. Trả về full URL: http://localhost:5076/api/upload/image-ck4?token=eyJ...
        return `${baseUrl}${UPLOAD_ENDPOINT}?token=${token}`;
    },

    /**
     * Upload ảnh thumbnail (Dùng lại endpoint của CKEditor cho tiện)
     */
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('upload', file);
        return axiosClient.post(UPLOAD_ENDPOINT, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
};

export default postService;