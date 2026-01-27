import axiosClient from './axiosClient';

const ENDPOINT = "/Student";

const studentService = {
    // Lấy danh sách trường
    getSchools: () => axiosClient.get(`${ENDPOINT}/schools`),

    // Lấy danh sách khóa học
    getCourses: () => axiosClient.get(`${ENDPOINT}/courses`),

    // Đăng nhập sinh viên
    login: (data) => axiosClient.post(`${ENDPOINT}/login`, data),

    // Cập nhật quân trang
    updateUniform: (data) => axiosClient.post(`${ENDPOINT}/uniform`, data),

    // Lấy lịch học
    getSchedule: () => axiosClient.get(`${ENDPOINT}/schedule`),

    // Lấy bảng điểm
    getGrades: () => axiosClient.get(`${ENDPOINT}/grades`),
};

export default studentService;
