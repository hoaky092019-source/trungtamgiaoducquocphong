import React, { useEffect, useState } from 'react';
import studentAdminService from '../../services/studentAdminService';
import unitService from '../../services/unitService';

const AdminStudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [schools, setSchools] = useState([]);
    const [courses, setCourses] = useState([]);

    // Modal States
    const [showEditModal, setShowEditModal] = useState(false);
    const [showModal, setShowModal] = useState(false); // Import Modal

    // Data States
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({});
    const [importFile, setImportFile] = useState(null);
    const [importResult, setImportResult] = useState(null);

    // Bulk Assign States
    const [showBulkModal, setShowBulkModal] = useState(false);
    const [bulkData, setBulkData] = useState({
        schoolId: '',
        courseId: '',
        studentClassId: '',
        battalionId: '',
        buildingIds: []
    });
    const [bulkLoading, setBulkLoading] = useState(false);
    const [schoolClasses, setSchoolClasses] = useState([]);
    const [battalions, setBattalions] = useState([]);
    const [battalionBuildings, setBattalionBuildings] = useState([]);

    useEffect(() => {
        loadData();
        fetchStudents();
        // Fetch Battalions (Type 1)
        unitService.getAll(1).then(res => setBattalions(res)).catch(console.error);
    }, []);

    // Fetch classes when School changes in Bulk Modal
    useEffect(() => {
        if (bulkData.schoolId) {
            studentAdminService.getClassesBySchool(bulkData.schoolId)
                .then(res => setSchoolClasses(res))
                .catch(err => console.error(err));
        } else {
            setSchoolClasses([]);
        }
    }, [bulkData.schoolId]);

    const loadData = async () => {
        try {
            const [schoolRes, courseRes] = await Promise.all([
                studentAdminService.getSchools(),
                studentAdminService.getCourses()
            ]);
            setSchools(Array.isArray(schoolRes) ? schoolRes : schoolRes.data || []);
            setCourses(Array.isArray(courseRes) ? courseRes : courseRes.data || []);
        } catch (error) {
            console.error(error);
        }
    };

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await studentAdminService.getStudents({ search });
            setStudents(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchStudents();
    };

    const handleDelete = async (id) => {
        if (window.confirm('Xóa sinh viên này? Hành động không thể hoàn tác.')) {
            await studentAdminService.deleteStudent(id);
            fetchStudents();
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({
            studentCode: student.studentCode,
            fullName: student.fullName,
            dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
            gender: student.gender,
            identificationNumber: student.identificationNumber,
            schoolId: student.schoolId,
            courseId: student.courseId,
            studentClassId: student.studentClassId
        });
        if (student.schoolId) {
            studentAdminService.getClassesBySchool(student.schoolId).then(res => setSchoolClasses(res));
        }
        setShowEditModal(true);
    };

    const handleSaveStudent = async () => {
        try {
            setLoading(true);
            await studentAdminService.updateStudent(editingStudent.id, formData);
            alert("Cập nhật thành công!");
            setShowEditModal(false);
            fetchStudents();
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra khi cập nhật.");
        } finally {
            setLoading(false);
        }
    };

    const handleImport = async () => {
        if (!importFile) return;
        setLoading(true);
        try {
            const res = await studentAdminService.importStudents(importFile);
            setImportResult(res);
            if (res.successCount > 0) fetchStudents();
        } catch (error) {
            console.error(error);
            alert("Lỗi khi import file");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const blob = await studentAdminService.downloadTemplate();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Student_Import_Template.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download Error:", error);
            alert("Lỗi tải file mẫu.");
        }
    };

    // --- Bulk Assign Handlers ---

    const handleBulkSubmit = async (e) => {
        e.preventDefault();
        if (!bulkData.schoolId || !bulkData.courseId) {
            alert('Vui lòng chọn Trường và Khóa học!');
            return;
        }
        if (!bulkData.battalionId) {
            alert('Vui lòng chọn Tiểu đoàn!');
            return;
        }
        if (bulkData.buildingIds.length === 0) {
            alert('Vui lòng chọn ít nhất một Dãy nhà!');
            return;
        }

        setBulkLoading(true);
        try {
            const payload = {
                schoolId: bulkData.schoolId,
                courseId: bulkData.courseId,
                studentClassId: bulkData.studentClassId || null,
                battalionId: bulkData.battalionId,
                buildingIds: bulkData.buildingIds
            };
            const res = await studentAdminService.bulkAssign(payload);
            alert(res.message);
            setShowBulkModal(false);
            fetchStudents();
        } catch (error) {
            alert('Lỗi khi phân bổ: ' + (error.response?.data || error.message));
        } finally {
            setBulkLoading(false);
        }
    };

    const toggleBuilding = (bId) => {
        setBulkData(prev => {
            const exists = prev.buildingIds.includes(bId);
            if (exists) return { ...prev, buildingIds: prev.buildingIds.filter(b => b !== bId) };
            return { ...prev, buildingIds: [...prev.buildingIds, bId] };
        });
    };

    return (
        <div className="container-fluid p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold m-0"><i className="fa-solid fa-user-graduate me-2"></i>Quản lý Sinh viên</h4>
                <div>
                    <button className="btn btn-warning me-2 text-dark fw-bold" onClick={() => setShowBulkModal(true)}>
                        <i className="fa-solid fa-wand-magic-sparkles me-2"></i>Phân bổ Tự động
                    </button>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <i className="fa-solid fa-plus me-2"></i>Thêm sinh viên
                    </button>
                </div>
            </div>

            {/* BULK ASSIGN MODAL */}
            {showBulkModal && (
                <div className="modal-backdrop-custom d-flex justify-content-center align-items-center" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="card shadow-lg" style={{ width: '500px' }}>
                        <div className="card-header bg-warning text-dark fw-bold d-flex justify-content-between">
                            <span><i className="fa-solid fa-wand-magic-sparkles me-2"></i>Phân bổ Sinh hoạt Tự động</span>
                            <button type="button" className="btn-close" onClick={() => setShowBulkModal(false)}></button>
                        </div>
                        <div className="card-body">
                            <p className="small text-muted mb-3">Công cụ này sẽ gán <b>Tiểu đoàn</b> và chia đều sinh viên vào các <b>Dãy nhà</b> đã chọn (theo Trường & Khóa).</p>

                            <div className="mb-3">
                                <label className="form-label fw-bold small">1. Chọn Nguồn (Sinh viên)</label>
                                <div className="d-flex gap-2 mb-2">
                                    <select className="form-select" value={bulkData.schoolId} onChange={e => setBulkData({ ...bulkData, schoolId: e.target.value, studentClassId: '' })}>
                                        <option value="">-- Chọn Trường --</option>
                                        {schools.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                    <select className="form-select" value={bulkData.courseId} onChange={e => setBulkData({ ...bulkData, courseId: e.target.value })}>
                                        <option value="">-- Chọn Khóa --</option>
                                        {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <select className="form-select text-primary fw-bold" value={bulkData.studentClassId} onChange={e => setBulkData({ ...bulkData, studentClassId: e.target.value })} disabled={!bulkData.schoolId}>
                                    <option value="">-- Chọn Lớp (Tất cả) --</option>
                                    {schoolClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold small">2. Chọn Tiểu đoàn Quản lý</label>
                                <select className="form-select" value={bulkData.battalionId || ''}
                                    onChange={e => {
                                        const bId = parseInt(e.target.value);
                                        setBulkData({ ...bulkData, battalionId: bId, buildingIds: [] });
                                        if (bId) {
                                            unitService.getBuildings(bId).then(res => setBattalionBuildings(res));
                                        } else {
                                            setBattalionBuildings([]);
                                        }
                                    }}>
                                    <option value="">-- Chọn Tiểu đoàn --</option>
                                    {battalions.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                </select>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-bold small">3. Chia vào các Dãy nhà (Check để chọn)</label>
                                {battalionBuildings.length === 0 ? (
                                    <p className="text-muted small fst-italic">Vui lòng chọn Tiểu đoàn trước (hoặc Tiểu đoàn chưa có nhà).</p>
                                ) : (
                                    <div className="d-flex flex-wrap gap-2">
                                        {battalionBuildings.map(b => (
                                            <div key={b.id} className={`btn btn-sm ${bulkData.buildingIds.includes(b.id) ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                onClick={() => toggleBuilding(b.id)}>
                                                {bulkData.buildingIds.includes(b.id) && <i className="fa-solid fa-check me-1"></i>} {b.name}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                <small className="text-muted fst-italic mt-1 d-block">Hệ thống sẽ chia đều sinh viên vào các nhà đã chọn.</small>
                            </div>

                            <div className="d-grid">
                                <button type="button" className="btn btn-warning fw-bold" onClick={handleBulkSubmit} disabled={bulkLoading}>
                                    {bulkLoading ? 'Đang xử lý...' : 'Thực hiện Phân bổ'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="card border-0 shadow-sm mb-4">
                <div className="card-body">
                    <form onSubmit={handleSearch} className="d-flex gap-2">
                        <input type="text" className="form-control" placeholder="Tìm kiếm theo tên hoặc MSSV..."
                            value={search} onChange={e => setSearch(e.target.value)} />
                        <button type="submit" className="btn btn-primary">
                            <i className="fa-solid fa-search me-2"></i>Tìm kiếm
                        </button>
                    </form>
                </div>
            </div>

            <div className="card border-0 shadow-sm">
                <div className="card-body p-0 table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4">MSSV</th>
                                <th>Họ và tên</th>
                                <th>Trường</th>
                                <th>Khóa</th>
                                <th>Lớp</th>
                                <th>Tiểu đoàn</th>
                                <th>Dãy nhà</th>
                                <th>Giới tính</th>
                                <th className="text-end pe-4">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? <tr><td colSpan="9" className="text-center py-4">Đang tải...</td></tr> : students.map(s => (
                                <tr key={s.id}>
                                    <td className="ps-4 fw-bold text-primary">{s.studentCode}</td>
                                    <td>{s.fullName}</td>
                                    <td className="small text-muted">{s.school?.code || 'N/A'}</td>
                                    <td className="small text-muted">{s.course?.name || 'N/A'}</td>
                                    <td className="small text-muted">{s.studentClass?.name || '-'}</td>
                                    <td className="small text-danger fw-bold">{s.battalion}</td>
                                    <td className="small text-success fw-bold">{s.building}</td>
                                    <td>{s.gender}</td>
                                    <td className="text-end pe-4">
                                        <button className="btn btn-sm btn-outline-primary border-0 bg-light me-2" onClick={() => handleEdit(s)}>
                                            <i className="fa-solid fa-pen-to-square"></i>
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

            {/* Import Modal */}
            {showModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Import Sinh viên từ Excel</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Chọn file Excel (.xlsx)</label>
                                    <input type="file" className="form-control" accept=".xlsx, .xls"
                                        onChange={e => setImportFile(e.target.files[0])} />
                                    <small className="text-muted">
                                        File mẫu gồm các cột: MSSV, Họ tên, Ngày sinh, Giới tính, CMND/CCCD, Mã Trường, Tên Khóa.
                                    </small>
                                </div>

                                {importResult && (
                                    <div className={`alert ${importResult.successCount > 0 ? 'alert-success' : 'alert-warning'}`}>
                                        <div><i className="fa-solid fa-check-circle me-2"></i>Thành công: <strong>{importResult.successCount}</strong> sinh viên</div>
                                        {importResult.errors && importResult.errors.length > 0 && (
                                            <div className="mt-2">
                                                <div className="fw-bold text-danger">Lỗi ({importResult.errors.length}):</div>
                                                <ul className="small text-danger m-0 ps-3" style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                                    {importResult.errors.map((err, idx) => <li key={idx}>{err}</li>)}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="modal-footer justify-content-between">
                                <div>
                                    <button type="button" className="btn btn-outline-info btn-sm" onClick={handleDownloadTemplate}>
                                        <i className="fa-solid fa-download me-2"></i> Tải file mẫu
                                    </button>
                                </div>
                                <div className="d-flex gap-2">
                                    <button type="button" className="btn btn-outline-secondary" onClick={() => setShowModal(false)}>
                                        <i className="fa-solid fa-xmark me-2"></i>Đóng
                                    </button>
                                    <button type="button" className="btn btn-primary" onClick={handleImport} disabled={!importFile}>
                                        <i className="fa-solid fa-upload me-2"></i> Tiến hành Import
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Cập nhật thông tin sinh viên</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form className="row g-3">
                                    <div className="col-md-6">
                                        <label className="form-label">MSSV</label>
                                        <input type="text" className="form-control" value={formData.studentCode} disabled />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Họ và tên</label>
                                        <input type="text" className="form-control" value={formData.fullName}
                                            onChange={e => setFormData({ ...formData, fullName: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Ngày sinh</label>
                                        <input type="date" className="form-control" value={formData.dateOfBirth}
                                            onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                                    </div>
                                    <div className="col-md-6">
                                        <label className="form-label">Giới tính</label>
                                        <select className="form-select" value={formData.gender}
                                            onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                                            <option value="Nam">Nam</option>
                                            <option value="Nữ">Nữ</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">CMND/CCCD</label>
                                        <input type="text" className="form-control" value={formData.identificationNumber}
                                            onChange={e => setFormData({ ...formData, identificationNumber: e.target.value })} />
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Trường</label>
                                        <select className="form-select" value={formData.schoolId}
                                            onChange={e => {
                                                setFormData({ ...formData, schoolId: e.target.value, studentClassId: '' });
                                                if (e.target.value) {
                                                    studentAdminService.getClassesBySchool(e.target.value).then(res => setSchoolClasses(res));
                                                } else {
                                                    setSchoolClasses([]);
                                                }
                                            }}>
                                            <option value="">-- Chọn trường --</option>
                                            {schools.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Khóa</label>
                                        <select className="form-select" value={formData.courseId}
                                            onChange={e => setFormData({ ...formData, courseId: e.target.value })}>
                                            <option value="">-- Chọn khóa --</option>
                                            {courses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <label className="form-label">Lớp sinh hoạt</label>
                                        <select className="form-select" value={formData.studentClassId || ''}
                                            onChange={e => setFormData({ ...formData, studentClassId: e.target.value })} disabled={!formData.schoolId}>
                                            <option value="">-- Chọn lớp --</option>
                                            {schoolClasses.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-outline-secondary" onClick={() => setShowEditModal(false)}>
                                    <i className="fa-solid fa-xmark me-2"></i>Đóng
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSaveStudent}>Lưu thay đổi</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminStudentsPage;
