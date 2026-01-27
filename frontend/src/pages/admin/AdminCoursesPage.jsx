import React, { useEffect, useState } from 'react';
import studentAdminService from '../../services/studentAdminService';

const AdminCoursesPage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', startDate: '', endDate: '', isActive: true });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const res = await studentAdminService.getCourses();
            setCourses(res);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await studentAdminService.updateCourse(editingId, { id: editingId, ...formData });
            } else {
                await studentAdminService.createCourse(formData);
            }
            setFormData({ name: '', startDate: '', endDate: '', isActive: true });
            setEditingId(null);
            fetchCourses();
        } catch (error) {
            alert('Có lỗi xảy ra!');
        }
    };

    const handleEdit = (course) => {
        setFormData({
            name: course.name,
            startDate: course.startDate.split('T')[0],
            endDate: course.endDate.split('T')[0],
            isActive: course.isActive
        });
        setEditingId(course.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa khóa học này?')) {
            try {
                await studentAdminService.deleteCourse(id);
                fetchCourses();
            } catch (error) {
                alert('Không thể xóa khóa học đã có dữ liệu!');
            }
        }
    };

    return (
        <div className="container-fluid p-4">
            <h4 className="mb-4 fw-bold">Quản lý Khóa học</h4>
            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white py-3 fw-bold border-bottom-0">
                            {editingId ? 'Cập nhật khóa học' : 'Thêm khóa học mới'}
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Tên khóa học</label>
                                    <input type="text" className="form-control" required
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="VD: Khóa 423 (Tháng 1/2026)" />
                                </div>
                                <div className="row">
                                    <div className="col-6 mb-3">
                                        <label className="form-label">Ngày bắt đầu</label>
                                        <input type="date" className="form-control" required
                                            value={formData.startDate} onChange={e => setFormData({ ...formData, startDate: e.target.value })} />
                                    </div>
                                    <div className="col-6 mb-3">
                                        <label className="form-label">Ngày kết thúc</label>
                                        <input type="date" className="form-control" required
                                            value={formData.endDate} onChange={e => setFormData({ ...formData, endDate: e.target.value })} />
                                    </div>
                                </div>
                                <div className="mb-3 form-check">
                                    <input type="checkbox" className="form-check-input" id="isActive"
                                        checked={formData.isActive} onChange={e => setFormData({ ...formData, isActive: e.target.checked })} />
                                    <label className="form-check-label" htmlFor="isActive">Đang kích hoạt</label>
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-primary'}`}>
                                        <i className="fa-solid fa-save me-2"></i> {editingId ? 'Cập nhật' : 'Thêm mới'}
                                    </button>
                                    {editingId && (
                                        <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData({ name: '', startDate: '', endDate: '', isActive: true }); }}>
                                            Hủy
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <div className="card border-0 shadow-sm">
                        <div className="card-body p-0 table-responsive">
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="ps-4">ID</th>
                                        <th>Tên khóa</th>
                                        <th>Thời gian</th>
                                        <th>Trạng thái</th>
                                        <th className="text-end pe-4">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? <tr><td colSpan="5" className="text-center py-4">Đang tải...</td></tr> : courses.map(c => (
                                        <tr key={c.id}>
                                            <td className="ps-4 text-muted">#{c.id}</td>
                                            <td className="fw-medium">{c.name}</td>
                                            <td className="small text-muted">
                                                {new Date(c.startDate).toLocaleDateString('vi-VN')} - {new Date(c.endDate).toLocaleDateString('vi-VN')}
                                            </td>
                                            <td>
                                                <span className={`badge ${c.isActive ? 'bg-success' : 'bg-secondary'} bg-opacity-10 text-${c.isActive ? 'success' : 'secondary'} rounded-pill`}>
                                                    {c.isActive ? 'Active' : 'Archived'}
                                                </span>
                                            </td>
                                            <td className="text-end pe-4">
                                                <button className="btn btn-sm btn-outline-primary me-2 border-0 bg-light" onClick={() => handleEdit(c)}>
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger border-0 bg-light" onClick={() => handleDelete(c.id)}>
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

export default AdminCoursesPage;
