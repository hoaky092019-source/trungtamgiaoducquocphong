import React, { useEffect, useState } from 'react';
import studentAdminService from '../../services/studentAdminService';
import { useOutletContext } from 'react-router-dom';

const StudentSchedulePage = () => {
    const [schedule, setSchedule] = useState({});
    const [loading, setLoading] = useState(true);
    const context = useOutletContext();
    const studentInfo = context?.studentInfo; // Access student info if available

    useEffect(() => {
        const fetchSchedule = async () => {
            try {
                // Ideally, we should fetch by student's courseId. 
                // For now, fetching all sessions for context or first available course if specific logic isn't ready.
                // Assuming studentInfo has courseId, else fallback.
                const courseId = studentInfo?.courseId || 1;
                const data = await studentAdminService.getSessions(courseId);

                // Group by Date
                const grouped = data.reduce((acc, session) => {
                    const dateKey = session.date.split('T')[0];
                    if (!acc[dateKey]) acc[dateKey] = [];
                    acc[dateKey].push(session);
                    return acc;
                }, {});

                setSchedule(grouped);
            } catch (error) {
                console.error("Failed to load schedule", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSchedule();
    }, [studentInfo]);

    const getDayName = (dateStr) => {
        const date = new Date(dateStr);
        const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
        return days[date.getDay()];
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    const sortedDates = Object.keys(schedule).sort();

    return (
        <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-white py-3 border-0">
                <h4 className="mb-0 fw-bold text-primary">
                    <i className="fa-regular fa-calendar-days me-2"></i> Lịch Học Tập (Chi tiết)
                </h4>
            </div>
            <div className="card-body p-0">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light text-secondary small text-uppercase">
                            <tr>
                                <th className="py-3 ps-4">Thứ / Ngày</th>
                                <th className="py-3" style={{ width: '40%' }}>Nội dung chi tiết</th>
                                <th className="py-3">Học phần</th>
                                <th className="py-3">Thông tin lớp học</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedDates.length > 0 ? (
                                sortedDates.map((date) => (
                                    <tr key={date} className="border-bottom-custom">
                                        <td className="ps-4 py-4" style={{ minWidth: '150px', verticalAlign: 'top' }}>
                                            <div className="fw-bold text-dark fs-5">{getDayName(date)}</div>
                                            <div className="text-muted small">{new Date(date).toLocaleDateString('vi-VN')}</div>
                                        </td>
                                        <td className="py-4">
                                            {schedule[date].map(session => (
                                                <div key={session.id} className="mb-3 border-start border-3 border-primary ps-3">
                                                    <div className="d-flex align-items-center mb-1">
                                                        <span className={`badge ${session.shift === 'Sáng' ? 'bg-warning text-dark' : 'bg-info text-white'} me-2`}>
                                                            {session.shift}
                                                        </span>
                                                        <span className="fw-bold text-primary">{session.content}</span>
                                                    </div>
                                                    <div className="text-muted small text-justify">{session.description || 'Không có ghi chú thêm.'}</div>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="py-4" style={{ verticalAlign: 'top' }}>
                                            {schedule[date].map(session => (
                                                <div key={session.id} className="mb-3">
                                                    <span className="badge bg-secondary">{session.subject?.code || 'HP'}</span>
                                                    <div className="small text-muted mt-1">{session.subject?.name}</div>
                                                </div>
                                            ))}
                                        </td>
                                        <td className="py-4 text-muted" style={{ verticalAlign: 'top' }}>
                                            {schedule[date].map(session => (
                                                <div key={session.id} className="mb-3">
                                                    <div className="d-flex align-items-center mb-1">
                                                        <i className="fa-solid fa-user text-muted me-2" style={{ width: '16px' }}></i>
                                                        <span className="fw-medium text-dark small">{session.lecturer || 'Chưa cập nhật'}</span>
                                                    </div>
                                                    <div className="d-flex align-items-center">
                                                        <i className="fa-solid fa-location-dot text-danger me-2" style={{ width: '16px' }}></i>
                                                        <span className="fw-medium small">{session.location || 'Giảng đường trung tâm'}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center py-5">
                                        <div className="text-muted fw-medium">Chưa có lịch học nào được cập nhật.</div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="card-footer bg-light py-3 border-0">
                <div className="d-flex align-items-center text-muted small">
                    <i className="fa-solid fa-circle-info me-2 text-primary"></i>
                    <span>Lịch học đã được cập nhật theo chuyên đề (GDQP-AN). Vui lòng mang đúng tài liệu và trang phục.</span>
                </div>
            </div>
        </div>
    );
};

export default StudentSchedulePage;
