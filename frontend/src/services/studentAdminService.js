import axiosClient from './axiosClient';

const ENDPOINT_SCHOOL = "/AdminSchools";
const ENDPOINT_COURSE = "/AdminCourses";
const ENDPOINT_STUDENT = "/AdminStudents";
const ENDPOINT_SCHEDULE = "/AdminSchedules";
const ENDPOINT_SESSION = "/TrainingSessions";

const studentAdminService = {
    // --- SCHOOLS ---
    getSchools: () => axiosClient.get(ENDPOINT_SCHOOL),
    getSchoolById: (id) => axiosClient.get(`${ENDPOINT_SCHOOL}/${id}`),
    createSchool: (data) => axiosClient.post(ENDPOINT_SCHOOL, data),
    updateSchool: (id, data) => axiosClient.put(`${ENDPOINT_SCHOOL}/${id}`, data),
    deleteSchool: (id) => axiosClient.delete(`${ENDPOINT_SCHOOL}/${id}`),
    getClassesBySchool: (schoolId) => axiosClient.get(`${ENDPOINT_SCHOOL}/${schoolId}/Classes`),

    // --- COURSES ---
    getCourses: () => axiosClient.get(ENDPOINT_COURSE),
    getCourseById: (id) => axiosClient.get(`${ENDPOINT_COURSE}/${id}`),
    createCourse: (data) => axiosClient.post(ENDPOINT_COURSE, data),
    updateCourse: (id, data) => axiosClient.put(`${ENDPOINT_COURSE}/${id}`, data),
    deleteCourse: (id) => axiosClient.delete(`${ENDPOINT_COURSE}/${id}`),

    // --- STUDENTS ---
    getStudents: (params) => axiosClient.get(ENDPOINT_STUDENT, { params }),
    getStudentById: (id) => axiosClient.get(`${ENDPOINT_STUDENT}/${id}`),
    createStudent: (data) => axiosClient.post(ENDPOINT_STUDENT, data),
    updateStudent: (id, data) => axiosClient.put(`${ENDPOINT_STUDENT}/${id}`, data),
    deleteStudent: (id) => axiosClient.delete(`${ENDPOINT_STUDENT}/${id}`),
    bulkAssign: (data) => axiosClient.post(`${ENDPOINT_STUDENT}/BulkAssign`, data),

    // --- SCHEDULES ---
    getSchedules: (courseId) => axiosClient.get(ENDPOINT_SCHEDULE, { params: { courseId } }),
    createSchedule: (data) => axiosClient.post(ENDPOINT_SCHEDULE, data),
    updateSchedule: (id, data) => axiosClient.put(`${ENDPOINT_SCHEDULE}/${id}`, data),
    deleteSchedule: (id) => axiosClient.delete(`${ENDPOINT_SCHEDULE}/${id}`),

    // --- TRAINING SESSIONS (GDQP Standard) ---
    // --- TRAINING SESSIONS (GDQP Standard) ---
    getSessions: (courseId) => axiosClient.get(ENDPOINT_SESSION, { params: { courseId } }),
    createSession: (data) => axiosClient.post(ENDPOINT_SESSION, data),
    updateSession: (id, data) => axiosClient.put(`${ENDPOINT_SESSION}/${id}`, data),
    deleteSession: (id) => axiosClient.delete(`${ENDPOINT_SESSION}/${id}`),
    getSubjects: () => axiosClient.get(`${ENDPOINT_SESSION}/Subjects`),
    getLessons: (subjectId) => axiosClient.get(`${ENDPOINT_SESSION}/Lessons`, { params: { subjectId } }),

    // Import
    importStudents: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return axiosClient.post(`${ENDPOINT_STUDENT}/import`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    },

    downloadTemplate: () => axiosClient.get(`${ENDPOINT_STUDENT}/template?t=${new Date().getTime()}`, { responseType: 'blob' })
};

export default studentAdminService;
