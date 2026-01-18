import axiosClient from './axiosClient';

const ENDPOINT = "/Student";

const studentService = {
    // Lấy danh sách trường
    getSchools: () => axiosClient.get(`${ENDPOINT}/schools`),

    // Lấy danh sách khóa học
    getCourses: () => axiosClient.get(`${ENDPOINT}/courses`),

    // Đăng nhập sinh viên
    login: (data) => axiosClient.post(`${ENDPOINT}/login`, data),
};

export default studentService;
