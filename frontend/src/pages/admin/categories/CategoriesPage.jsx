import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import categoryService from '../../../services/categoryService';
import ConfirmModal from '../../../components/common/ConfirmModal';

const CategoriesPage = () => {
    // Data State
    const [categories, setCategories] = useState([]);

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
            const params = { keyword: searchTerm };
            const data = await categoryService.getAll(params);
            setCategories(data);
        } catch (error) {
            console.error("Lỗi tải danh mục:", error);
            toast.error("Không thể tải danh sách danh mục");
        } finally {
            setLoading(false);
        }
    };

    const handleExport = async () => {
        try {
            const params = { keyword: searchTerm };
            const response = await categoryService.exportCategories(params);

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `categories_export_${new Date().toISOString().slice(0, 10)}.csv`);
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
                const res = await categoryService.remove(deleteId);
                toast.success(res.message || "Đã xóa danh mục!");
                loadData();
            } catch (error) {
                toast.error("Lỗi khi xóa! Có thể danh mục này đang chứa danh mục con.");
            }
            setIsModalOpen(false);
            setDeleteId(null);
        }
    };

    return (
        <div className="container-fluid px-0 px-md-3">
            <div className="page-header-wrapper d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="page-title mb-1">Danh mục Bài viết</h2>
                    <p className="page-subtitle mb-0">Quản lý phân loại tin tức và sự kiện</p>
                </div>
                <div className="d-flex gap-2">
                    <button onClick={handleExport} className="btn btn-outline-success">
                        <i className="fa-solid fa-file-excel me-2"></i> Xuất Excel
                    </button>
                    <Link to="/admin/categories/add" className="btn-primary-custom text-center text-decoration-none">
                        <i className="fa-solid fa-plus me-2"></i> Thêm mới
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
                        placeholder="Tìm kiếm danh mục..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="table-card">
                <div className="table-responsive">
                    <table className="custom-table table table-hover mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="d-none d-md-table-cell" style={{ width: '60px' }}>ID</th>
                                <th>Tên Danh mục</th>
                                <th>Danh mục Cha</th>
                                <th className="d-none d-lg-table-cell">Mô tả</th>
                                <th className="text-end" style={{ minWidth: '100px' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="5" className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
                            ) : categories.map((item) => (
                                <tr key={item.categoryId}>
                                    <td className="d-none d-md-table-cell">
                                        <span className="text-muted">#{item.categoryId}</span>
                                    </td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            <i className="fa-regular fa-folder-open text-warning fa-lg d-none d-sm-inline"></i>
                                            <span className="fw-bold text-dark text-break">{item.categoryName}</span>
                                        </div>
                                        <div className="d-lg-none text-muted small mt-1 text-truncate" style={{ maxWidth: '200px' }}>
                                            {item.description}
                                        </div>
                                    </td>
                                    <td>
                                        {item.parentCategoryName === "--- Gốc ---" ? (
                                            <span className="badge bg-light text-secondary border">Gốc</span>
                                        ) : (
                                            <span className="badge-status bg-soft-primary text-truncate d-inline-block" style={{ maxWidth: '120px' }}>
                                                <i className="fa-solid fa-turn-up fa-rotate-90 me-1"></i>
                                                {item.parentCategoryName}
                                            </span>
                                        )}
                                    </td>
                                    <td className="d-none d-lg-table-cell text-muted text-truncate" style={{ maxWidth: '300px' }}>
                                        {item.description}
                                    </td>
                                    <td className="text-end">
                                        <div className="d-flex justify-content-end gap-2">
                                            <Link to={`/admin/categories/edit/${item.categoryId}`} className="action-btn btn-edit">
                                                <i className="fa-solid fa-pen"></i>
                                            </Link>
                                            <button onClick={() => handleDeleteClick(item.categoryId)} className="action-btn btn-delete">
                                                <i className="fa-regular fa-trash-can"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {!loading && categories.length === 0 && (
                                <tr><td colSpan="5" className="text-center p-4">Chưa có danh mục nào phù hợp</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <ConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Xóa danh mục?"
                message="Bạn có chắc chắn muốn xóa danh mục này không? Hành động này không thể hoàn tác."
            />
        </div>
    );
};

export default CategoriesPage;