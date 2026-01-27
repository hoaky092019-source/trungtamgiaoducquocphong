import React, { useEffect, useState } from 'react';
import studentAdminService from '../../services/studentAdminService';

const AdminSchoolsPage = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', code: '' });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchSchools();
    }, []);

    const fetchSchools = async () => {
        try {
            const res = await studentAdminService.getSchools();
            setSchools(res);
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
                await studentAdminService.updateSchool(editingId, { id: editingId, ...formData });
            } else {
                await studentAdminService.createSchool(formData);
            }
            setFormData({ name: '', code: '' });
            setEditingId(null);
            fetchSchools();
        } catch (error) {
            alert('Có lỗi xảy ra!');
        }
    };

    const handleEdit = (school) => {
        setFormData({ name: school.name, code: school.code });
        setEditingId(school.id);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa trường này?')) {
            try {
                await studentAdminService.deleteSchool(id);
                fetchSchools();
            } catch (error) {
                alert('Không thể xóa trường đang có sinh viên!');
            }
        }
    };

    return (
        <div className="container-fluid p-4">
            <h4 className="mb-4 fw-bold">Quản lý Trường Đại học/Cao đẳng</h4>
            <div className="row">
                <div className="col-md-4 mb-4">
                    <div className="card border-0 shadow-sm">
                        <div className="card-header bg-white py-3 fw-bold border-bottom-0">
                            {editingId ? 'Cập nhật trường' : 'Thêm trường mới'}
                        </div>
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Mã trường</label>
                                    <input type="text" className="form-control" required
                                        value={formData.code} onChange={e => setFormData({ ...formData, code: e.target.value })}
                                        placeholder="VD: HUTECH" />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Tên trường</label>
                                    <input type="text" className="form-control" required
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="VD: Đại học Công nghệ TP.HCM" />
                                </div>
                                <div className="d-grid gap-2">
                                    <button type="submit" className={`btn ${editingId ? 'btn-warning' : 'btn-primary'}`}>
                                        <i className="fa-solid fa-save me-2"></i> {editingId ? 'Cập nhật' : 'Thêm mới'}
                                    </button>
                                    {editingId && (
                                        <button type="button" className="btn btn-secondary" onClick={() => { setEditingId(null); setFormData({ name: '', code: '' }); }}>
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
                                        <th>Mã trường</th>
                                        <th>Tên trường</th>
                                        <th className="text-end pe-4">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {loading ? <tr><td colSpan="4" className="text-center py-4">Đang tải...</td></tr> : schools.map(s => (
                                        <tr key={s.id}>
                                            <td className="ps-4 text-muted">#{s.id}</td>
                                            <td className="fw-bold text-primary">{s.code}</td>
                                            <td>{s.name}</td>
                                            <td className="text-end pe-4">
                                                <button className="btn btn-sm btn-outline-primary me-2 border-0 bg-light" onClick={() => handleEdit(s)}>
                                                    <i className="fa-solid fa-pen"></i>
                                                </button>
                                                <button className="btn btn-sm btn-outline-danger border-0 bg-light" onClick={() => handleDelete(s.id)}>
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

export default AdminSchoolsPage;
