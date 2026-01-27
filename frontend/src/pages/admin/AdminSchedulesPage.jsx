import React, { useEffect, useState } from 'react';
import studentAdminService from '../../services/studentAdminService';

const AdminSchedulesPage = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [sessions, setSessions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [lessons, setLessons] = useState([]); // Store lessons for selected subject
    const [loading, setLoading] = useState(false);

    // Initial Form State
    const initialFormState = {
        date: '',
        shift: 'Sáng',
        subjectId: '',
        content: '',
        location: '',
        lecturer: '',
        courseId: ''
    };

    const [formData, setFormData] = useState(initialFormState);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadMetadata();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchSessions(selectedCourse);
            setFormData(prev => ({ ...prev, courseId: selectedCourse }));
        } else {
            setSessions([]);
        }
    }, [selectedCourse]);

    // Fetch lessons when subjectId changes
    useEffect(() => {
        if (formData.subjectId) {
            fetchLessons(formData.subjectId);
        } else {
            setLessons([]);
        }
    }, [formData.subjectId]);

    const loadMetadata = async () => {
        try {
            const [coursesRes, subjectsRes] = await Promise.all([
                studentAdminService.getCourses(),
                studentAdminService.getSubjects()
            ]);
            setCourses(coursesRes);
            setSubjects(subjectsRes);
            if (coursesRes.length > 0) setSelectedCourse(coursesRes[0].id);
        } catch (error) {
            console.error("Error loading metadata:", error);
        }
    };

    const fetchSessions = async (courseId) => {
        setLoading(true);
        try {
            const res = await studentAdminService.getSessions(courseId);
            setSessions(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchLessons = async (subjectId) => {
        try {
            const res = await studentAdminService.getLessons(subjectId);
            setLessons(res);
        } catch (error) {
            console.error("Error loading lessons:", error);
            setLessons([]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, date: new Date(formData.date).toISOString() };

            if (editingId) {
                await studentAdminService.updateSession(editingId, { id: editingId, ...payload });
            } else {
                await studentAdminService.createSession(payload);
            }

            // Reset form partly
            setFormData(prev => ({
                ...prev,
                shift: 'Sáng',
                content: '',
                location: '',
                lecturer: '' // Keep date & courseId
            }));
            setEditingId(null);
            fetchSessions(selectedCourse);
        } catch (error) {
            alert('Lỗi khi lưu buổi học!');
            console.error(error);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            courseId: item.courseId,
            date: item.date.split('T')[0],
            shift: item.shift,
            subjectId: item.subjectId,
            content: item.content,
            location: item.location || '',
            lecturer: item.lecturer || ''
        });
        setEditingId(item.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Xóa buổi học này?')) {
            await studentAdminService.deleteSession(id);
            fetchSessions(selectedCourse);
        }
    };

    const handleLessonSelect = (e) => {
        const lessonName = e.target.value;
        setFormData(prev => ({ ...prev, content: lessonName }));
    };

    // Helper to get subject name
    const getSubjectName = (id) => subjects.find(s => s.id === id)?.code || 'N/A';

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0"><i className="fa-solid fa-calendar-days me-2"></i>Quản lý Lịch học (Chi tiết)</h4>
                <select className="form-select w-auto" value={selectedCourse} onChange={e => setSelectedCourse(e.target.value)}>
                    <option value="">-- Chọn khóa học --</option>
                    {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
            </div>

            <div className="row">
                {/* Form Input */}
                <div className="col-lg-4 mb-4">
                    <div className="card border-0 shadow-sm sticky-top" style={{ top: '20px', zIndex: 10 }}>
                        <div className="card-header bg-primary text-white py-3 fw-bold">
                            {editingId ? 'Cập nhật Buổi học' : 'Thêm Buổi học Mới'}
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-md-7 mb-3">
                                        <label className="form-label small fw-bold text-muted">Ngày học</label>
                                        <input type="date" className="form-control" required
                                            value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                                    </div>
                                    <div className="col-md-5 mb-3">
                                        <label className="form-label small fw-bold text-muted">Buổi</label>
                                        <select className="form-select" value={formData.shift} onChange={e => setFormData({ ...formData, shift: e.target.value })}>
                                            <option value="Sáng">Sáng</option>
                                            <option value="Chiều">Chiều</option>
                                            <option value="Tối">Tối</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Học phần</label>
                                    <select className="form-select" required value={formData.subjectId} onChange={e => setFormData({ ...formData, subjectId: e.target.value })}>
                                        <option value="">-- Chọn Học phần --</option>
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.code} - {s.name}</option>)}
                                    </select>
                                </div>

                                {lessons.length > 0 && (
                                    <div className="mb-3">
                                        <label className="form-label small fw-bold text-success"><i className="fa-solid fa-lightbulb me-1"></i>Chọn Bài học có sẵn</label>
                                        <select className="form-select border-success" onChange={handleLessonSelect} value="">
                                            <option value="">-- Chọn bài học mẫu (tự động điền) --</option>
                                            {lessons.map(l => <option key={l.id} value={l.name}>{l.name}</option>)}
                                        </select>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <label className="form-label small fw-bold text-muted">Nội dung bài học</label>
                                    <textarea className="form-control" rows="3" required placeholder="Ví dụ: Bài 1: Đội ngũ từng người..."
                                        value={formData.content} onChange={e => setFormData({ ...formData, content: e.target.value })}></textarea>
                                </div>

                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label small fw-bold text-muted">Giảng viên</label>
                                        <input type="text" className="form-control" placeholder="Tên giảng viên"
                                            value={formData.lecturer} onChange={e => setFormData({ ...formData, lecturer: e.target.value })} />
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label small fw-bold text-muted">Địa điểm</label>
                                        <input type="text" className="form-control" placeholder="C1, Bãi tập..."
                                            value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
                                    </div>
                                </div>

                                <div className="d-grid gap-2 mt-3">
                                    <button type="submit" className="btn btn-primary" disabled={!selectedCourse}>
                                        <i className="fa-solid fa-save me-2"></i>Lưu buổi học
                                    </button>
                                    {editingId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData({ ...formData, ...initialFormState, courseId: selectedCourse, date: formData.date }); }}>Hủy</button>}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* List Table */}
                <div className="col-lg-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-0 table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light text-muted small">
                                    <tr>
                                        <th className="ps-4 py-3">Ngày / Buổi</th>
                                        <th>Học phần</th>
                                        <th style={{ width: '30%' }}>Nội dung</th>
                                        <th>Giảng viên / Địa điểm</th>
                                        <th className="text-end pe-4">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? <tr><td colSpan="5" className="text-center py-5">Đang tải dữ liệu...</td></tr> : sessions.length === 0 ? <tr><td colSpan="5" className="text-center py-5 text-muted">Chưa có lịch học nào.</td></tr> : sessions.map(s => (
                                        <tr key={s.id}>
                                            <td className="ps-4">
                                                <div className="fw-bold text-dark">{new Date(s.date).toLocaleDateString('vi-VN')}</div>
                                                <span className={`badge ${s.shift === 'Sáng' ? 'bg-warning text-dark' : 'bg-info text-white'} bg-opacity-75 rounded-pill px-3 mt-1`}>
                                                    {s.shift}
                                                </span>
                                            </td>
                                            <td>
                                                <span className="badge bg-secondary">{getSubjectName(s.subjectId)}</span>
                                            </td>
                                            <td>
                                                <div className="text-dark small fw-medium" style={{ maxWidth: '250px' }}>{s.content}</div>
                                            </td>
                                            <td>
                                                <div className="small mb-1"><i className="fa-solid fa-user text-muted me-2" style={{ width: '16px' }}></i>{s.lecturer || '---'}</div>
                                                <div className="small"><i className="fa-solid fa-location-dot text-danger me-2" style={{ width: '16px' }}></i>{s.location || '---'}</div>
                                            </td>
                                            <td className="text-end pe-4">
                                                <button className="btn btn-sm btn-light border me-2 text-primary" onClick={() => handleEdit(s)}>
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button className="btn btn-sm btn-light border text-danger" onClick={() => handleDelete(s.id)}>
                                                    <i className="fa-solid fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSchedulesPage;
