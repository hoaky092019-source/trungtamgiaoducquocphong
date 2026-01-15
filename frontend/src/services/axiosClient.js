import axios from 'axios';

// QUAN TRỌNG: Để '/api' (không có localhost) 
// Hệ thống sẽ tự hiểu là: [Domain hiện tại] + /api
const axiosClient = axios.create({
    baseURL: 'http://localhost:5076/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// --- INTERCEPTOR REQUEST (Gửi đi) ---
axiosClient.interceptors.request.use(async (config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
        const user = JSON.parse(userStr);

        // Kiểm tra token đã hết hạn chưa
        if (user.expiresAt && Date.now() >= user.expiresAt) {
            console.log("Token đã hết hạn...");
            localStorage.removeItem('user');

            // Chỉ chuyển về /login nếu đang ở trang admin
            if (window.location.pathname.startsWith('/admin')) {
                console.log("Đang ở trang admin -> Chuyển về /login");
                window.location.href = '/login';
            } else {
                console.log("Đang ở trang public -> Xóa token và tiếp tục như khách");
            }

            return Promise.reject(new Error('Token đã hết hạn'));
        }

        if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// --- INTERCEPTOR RESPONSE (Nhận về) ---
axiosClient.interceptors.response.use((response) => {
    // Interceptor này giúp bạn lấy thẳng dữ liệu, bỏ qua lớp vỏ "data" của axios
    if (response && response.data) {
        return response.data;
    }
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        // Chỉ bắt login nếu đang cố gắng truy cập trang Admin
        if (window.location.pathname.startsWith('/admin')) {
            console.log("Token hết hạn hoặc không hợp lệ -> Logout");
            localStorage.removeItem('user');
            window.location.href = '/login';
        } else {
            // Ở trang public, nếu token sai thì chỉ xóa đi và reload để fetch lại như khách
            if (localStorage.getItem('user')) {
                localStorage.removeItem('user');
                window.location.reload();
            }
        }
    }
    throw error;
});

export default axiosClient;