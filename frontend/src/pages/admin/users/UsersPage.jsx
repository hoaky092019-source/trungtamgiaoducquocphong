import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import userService from '../../../services/userService';
import ConfirmModal from '../../../components/common/ConfirmModal';

const UsersPage = () => {
    // State filters
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');

    // UI state
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            loadData();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchTerm, roleFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            const params = {
                keyword: searchTerm,
                roleName: roleFilter,
                // facultyId: ... if you want to add faculty filter later
            };
            const data = await userService.getAll(params);
            setUsers(data);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải danh sách người dùng");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const params = {
                keyword: searchTerm,
                roleName: roleFilter,
            };
            const response = await userService.exportUsers(params);

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const contentDisposition = response.headers['content-disposition'];
            let fileName = 'users_export.csv';
            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (fileNameMatch.length === 2)
                    fileName = fileNameMatch[1];
            }
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
            toast.error("Xuất báo cáo thất bại!");
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            try {
                await userService.remove(deleteId);
                toast.success("Đã xóa người dùng thành công!");
                loadData();
            } catch (error) {
                toast.error("Lỗi khi xóa người dùng!");
            }
            setIsModalOpen(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="container-fluid px-0 px-md-3">
            {/* 1. Header Responsive */}
            <div className="page-header-wrapper d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="page-title mb-1">Danh sách Người dùng</h2>
                    <p className="page-subtitle mb-0">Quản lý hồ sơ cán bộ, giảng viên và học viên</p>
                </div>
                <div className="d-flex gap-2">
                    <button onClick={handleExport} className="btn btn-outline-success">
                        <i className="fa-solid fa-file-excel me-2"></i> Xuất Excel
                    </button>
                    <Link to="/admin/users/new" className="btn-primary-custom text-center text-decoration-none">
                        <i className="fa-solid fa-plus me-2"></i> Thêm mới
                    </Link>
                </div>
            </div>

            {/* 2. Toolbar Responsive */}
            <div className="crud-toolbar mb-3 d-flex flex-column flex-md-row gap-3">
                <div className="search-box-wrapper w-100 w-md-auto flex-grow-1" style={{ maxWidth: '100%' }}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        className="form-control-search w-100"
                        placeholder="Tìm kiếm theo tên, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="form-select-filter w-100 w-md-auto"
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="All">Tất cả quyền</option>
                    <option value="Admin">Admin</option>
                    <option value="FacultyAdmin">QTV Khoa</option>
                    <option value="Teacher">Giảng viên</option>
                    <option value="Student">Học viên</option>
                </select>
            </div>

            {/* 3. Table Responsive */}
            <div className="table-card">
                <div className="table-responsive">
                    <table className="custom-table table table-hover mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th>Thông tin thành viên</th>
                                <th className="d-none d-md-table-cell">Vai trò</th>
                                <th className="d-none d-lg-table-cell">Khoa / Phòng</th>
                                <th className="d-none d-sm-table-cell">Trạng thái</th>
                                <th className="text-end" style={{ minWidth: '100px' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="visually-hidden">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : users.length > 0 ? (
                                users.map((u) => (
                                    <tr key={u.userId}>
                                        <td>
                                            <div className="info-group d-flex align-items-center gap-3">
                                                <img
                                                    src={`https://ui-avatars.com/api/?name=${u.fullName}&background=random`}
                                                    alt="Avatar"
                                                    className="avatar-sm rounded-circle"
                                                    style={{ width: '40px', height: '40px' }}
                                                />
                                                <div className="info-text">
                                                    <h6 className="mb-0 fw-bold">{u.fullName}</h6>
                                                    <small className="text-muted d-block">{u.email || u.username}</small>

                                                    {/* Mobile Info */}
                                                    <div className="d-md-none mt-1">
                                                        <span className="badge bg-light text-dark border me-1">{u.roleName}</span>
                                                        {u.status ?
                                                            <span className="badge bg-success-subtle text-success d-sm-none">Active</span> :
                                                            <span className="badge bg-danger-subtle text-danger d-sm-none">Locked</span>
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="d-none d-md-table-cell">
                                            <span className="badge-status bg-soft-primary">{u.roleName}</span>
                                        </td>
                                        <td className="d-none d-lg-table-cell text-truncate" style={{ maxWidth: '200px' }}>
                                            {u.facultyName && u.facultyName !== "N/A" ? (
                                                <span className="fw-medium text-dark">{u.facultyName}</span>
                                            ) : (
                                                <span className="text-muted fst-italic">--</span>
                                            )}
                                        </td>
                                        <td className="d-none d-sm-table-cell">
                                            {u.status ?
                                                <span className="badge-status bg-soft-success">Hoạt động</span> :
                                                <span className="badge-status bg-soft-danger">Đã khóa</span>
                                            }
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <Link to={`/admin/users/edit/${u.userId}`} className="action-btn btn-edit">
                                                    <i className="fa-solid fa-pen"></i>
                                                </Link>
                                                <button onClick={() => handleDeleteClick(u.userId)} className="action-btn btn-delete">
                                                    <i className="fa-regular fa-trash-can"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="empty-state text-center py-5">
                                        <i className="fa-solid fa-magnifying-glass-minus fa-2x mb-3 text-muted opacity-25"></i>
                                        <p className="text-muted">Không tìm thấy dữ liệu phù hợp</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xóa người dùng?"
                message="Bạn có chắc chắn muốn xóa tài khoản này không? Hành động này không thể khôi phục."
            />
        </div>
    );
};

export default UsersPage;