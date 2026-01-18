import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import studentService from '../../services/studentService';

const StudentLoginWidget = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    // Form State
    const [schoolId, setSchoolId] = useState('');
    const [courseId, setCourseId] = useState('');
    const [studentCode, setStudentCode] = useState('');

    // Data State
    const [schools, setSchools] = useState([]);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const [schoolRes, courseRes] = await Promise.all([
                    studentService.getSchools(),
                    studentService.getCourses()
                ]);
                setSchools(schoolRes);
                setCourses(courseRes);
            } catch (error) {
                console.error("Failed to load metadata", error);
            }
        };
        fetchMetadata();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!schoolId || !courseId || !studentCode) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        setLoading(true);
        try {
            const res = await studentService.login({
                schoolId: parseInt(schoolId),
                courseId: parseInt(courseId),
                studentCode: studentCode
            });

            // Login Success
            // Save token and info
            localStorage.setItem('studentToken', res.token);
            localStorage.setItem('studentInfo', JSON.stringify(res.student));

            // Redirect to Dashboard
            navigate('/cong-thong-tin-sinh-vien/dashboard');

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại!';
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card shadow-sm border-0 mb-4 overflow-hidden">
            <div className="card-header bg-primary text-white py-3">
                <h5 className="mb-0 text-center fw-bold text-uppercase">
                    <i className="fa-solid fa-graduation-cap me-2"></i>
                    Cổng Sinh Viên
                </h5>
            </div>
            <div className="card-body p-4 bg-light">
                <form onSubmit={handleLogin}>
                    {/* School Select */}
                    <div className="mb-3">
                        <label className="form-label fw-medium text-secondary small">Trường Đại học/Cao đẳng</label>
                        <select
                            className="form-select"
                            value={schoolId}
                            onChange={(e) => setSchoolId(e.target.value)}
                        >
                            <option value="">-- Chọn trường --</option>
                            {schools.map(school => (
                                <option key={school.id} value={school.id}>{school.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Course Select */}
                    <div className="mb-3">
                        <label className="form-label fw-medium text-secondary small">Khóa học</label>
                        <select
                            className="form-select"
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                        >
                            <option value="">-- Chọn khóa --</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Student Code Input */}
                    <div className="mb-4">
                        <label className="form-label fw-medium text-secondary small">Mã số sinh viên</label>
                        <div className="input-group">
                            <span className="input-group-text bg-white text-secondary">
                                <i className="fa-regular fa-id-card"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập MSSV"
                                value={studentCode}
                                onChange={(e) => setStudentCode(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="btn btn-primary w-100 fw-bold py-2 text-uppercase"
                        disabled={loading}
                    >
                        {loading ? (
                            <span><i className="fa-solid fa-spinner fa-spin me-2"></i> Đang xử lý...</span>
                        ) : (
                            <span><i className="fa-solid fa-magnifying-glass me-2"></i> Tra cứu thông tin</span>
                        )}
                    </button>
                </form>

                {/* Guide Text */}
                <div className="mt-3 text-center">
                    <small className="text-muted fst-italic">
                        * Nhập đúng MSSV do trường cấp để tra cứu.
                    </small>
                </div>
            </div>
        </div>
    );
};

export default StudentLoginWidget;
