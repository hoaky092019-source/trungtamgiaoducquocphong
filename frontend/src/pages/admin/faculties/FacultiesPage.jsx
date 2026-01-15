import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import facultyService from '../../../services/facultyService';
import ConfirmModal from '../../../components/common/ConfirmModal';

const FacultiesPage = () => {
    // Data State
    const [faculties, setFaculties] = useState([]);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');

    // UI State
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            loadData();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Updated to pass query params
            const params = { keyword: searchTerm };
            const data = await facultyService.getAll(params);
            setFaculties(data);
        } catch (error) {
            console.error("Lỗi load khoa:", error);
            toast.error("Không thể tải danh sách khoa");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const params = { keyword: searchTerm };
            const response = await facultyService.exportFaculties(params);

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `faculties_export_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
            toast.error("Xuất báo cáo thất bại");
        }
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (deleteId) {
            try {
                await facultyService.remove(deleteId);
                toast.success("Đã xóa khoa thành công!");
                loadData();
            } catch (error) {
                toast.error("Không thể xóa (Có thể khoa đang có dữ liệu liên quan).");
            }
            setIsModalOpen(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="container-fluid px-0 px-md-3">
            {/* Header: Responsive Flexbox */}
            <div className="page-header-wrapper d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="page-title mb-1">Quản lý Khoa / Ban</h2>
                    <p className="page-subtitle mb-0">Danh sách các đơn vị đào tạo và phòng ban</p>
                </div>
                <div className="d-flex gap-2">
                    <button onClick={handleExport} className="btn btn-outline-success">
                        <i className="fa-solid fa-file-excel me-2"></i> Xuất Excel
                    </button>
                    <Link to="/admin/faculties/new" className="btn-primary-custom text-center text-decoration-none">
                        <i className="fa-solid fa-plus me-2"></i> Thêm Khoa
                    </Link>
                </div>
            </div>

            {/* Toolbar: Search bar responsive */}
            <div className="crud-toolbar mb-3">
                <div className="search-box-wrapper w-100 w-md-auto" style={{ maxWidth: '100%', minWidth: '300px' }}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        className="form-control-search w-100"
                        placeholder="Tìm kiếm tên khoa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table: Scrollable & Hidden columns */}
            <div className="table-card">
                <div className="table-responsive">
                    <table className="custom-table table table-hover mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="d-none d-md-table-cell" style={{ width: '50px' }}>ID</th>
                                <th>Tên Đơn vị</th>
                                <th className="d-none d-lg-table-cell">Mô tả</th>
                                <th className="d-none d-md-table-cell">Ngày tạo</th>
                                <th className="text-end" style={{ minWidth: '100px' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
                            ) : faculties.length > 0 ? (
                                faculties.map((item) => (
                                    <tr key={item.facultyId}>
                                        <td className="d-none d-md-table-cell">
                                            <span className="text-muted">#{item.facultyId}</span>
                                        </td>
                                        <td>
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-light rounded p-2 text-primary d-none d-sm-block">
                                                    <i className="fa-regular fa-building fa-lg"></i>
                                                </div>
                                                <div>
                                                    <span className="fw-bold text-dark d-block">{item.facultyName}</span>
                                                    {/* Hiện mô tả ngắn trên mobile vì cột mô tả chính đã ẩn */}
                                                    <small className="text-muted d-lg-none text-truncate d-block" style={{ maxWidth: '150px' }}>
                                                        {item.description}
                                                    </small>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="d-none d-lg-table-cell text-muted text-truncate" style={{ maxWidth: '300px' }}>
                                            {item.description || "Chưa có mô tả"}
                                        </td>
                                        <td className="d-none d-md-table-cell">
                                            <span className="badge-status bg-soft-warning">
                                                {item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                                            </span>
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                <Link to={`/admin/faculties/edit/${item.facultyId}`} className="action-btn btn-edit">
                                                    <i className="fa-solid fa-pen"></i>
                                                </Link>
                                                <button onClick={() => handleDeleteClick(item.facultyId)} className="action-btn btn-delete">
                                                    <i className="fa-regular fa-trash-can"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="empty-state py-5 text-center text-muted">
                                        <i className="fa-solid fa-box-open fa-2x mb-3 d-block opacity-25"></i>
                                        Không tìm thấy dữ liệu
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
                title="Xóa Khoa/Phòng?"
                message="Bạn có chắc chắn muốn xóa đơn vị này không? Hành động này không thể khôi phục."
            />
        </div>
    );
};

export default FacultiesPage;