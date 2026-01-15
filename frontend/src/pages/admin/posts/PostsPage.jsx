import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import postService from '../../../services/postService';
import categoryService from '../../../services/categoryService';
import ConfirmModal from '../../../components/common/ConfirmModal';

const PostsPage = () => {
    // Data State
    const [posts, setPosts] = useState([]);
    const [categories, setCategories] = useState([]);

    // Filter State
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    // UI State
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Approval State
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectId, setRejectId] = useState(null);
    const [rejectComment, setRejectComment] = useState("");

    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const role = user ? user.roleName : 'Teacher';

    useEffect(() => {
        // Fetch Categories for filter dropdown
        const fetchCats = async () => {
            try {
                const cats = await categoryService.getAll();
                setCategories(cats);
            } catch (err) { console.error(err); }
        };
        fetchCats();
    }, []);

    useEffect(() => {
        // Debounce search
        const timer = setTimeout(() => {
            loadData();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, statusFilter, categoryFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            const params = {
                keyword: searchTerm,
                status: statusFilter,
                categoryId: categoryFilter || null
            };
            const data = await postService.getAll(params);
            setPosts(data);
        } catch (error) { console.log(error); }
        finally { setLoading(false); }
    };

    const handleExport = async () => {
        try {
            const params = {
                keyword: searchTerm,
                status: statusFilter,
                categoryId: categoryFilter || null
            };
            const response = await postService.exportPosts(params);

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `posts_export_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error(error);
            toast.error("Xuất báo cáo thất bại");
        }
    };

    const handleDeleteClick = (id) => { setDeleteId(id); setIsModalOpen(true); };

    const handleConfirmDelete = async () => {
        try {
            await postService.remove(deleteId);
            toast.success("Đã xóa bài viết!");
            loadData();
        } catch (error) {
            toast.error("Lỗi khi xóa bài viết!");
        }
        setIsModalOpen(false);
    };

    const handleApprove = async (id) => {
        try {
            await postService.approve(id, "Đã duyệt");
            toast.success("Phê duyệt thành công!");
            loadData();
        } catch (error) {
            toast.error("Lỗi khi duyệt bài!");
        }
    };

    const handleReject = async () => {
        if (!rejectComment.trim()) {
            toast.warning("Vui lòng nhập lý do từ chối");
            return;
        }
        try {
            await postService.reject(rejectId, rejectComment);
            toast.success("Đã từ chối bài viết");
            setIsRejectModalOpen(false);
            setRejectComment("");
            loadData();
        } catch (error) {
            toast.error("Lỗi khi thực hiện");
        }
    };

    const renderStatusBadge = (status) => {
        switch (status) {
            case 'Published': return <span className="badge-status bg-soft-success">Công khai</span>;
            case 'Pending': return <span className="badge-status bg-soft-warning">Chờ duyệt</span>;
            case 'Rejected': return <span className="badge-status bg-soft-danger">Từ chối</span>;
            case 'Draft': return <span className="badge-status bg-soft-secondary">Bản nháp</span>;
            default: return <span className="badge-status bg-soft-info">{status}</span>;
        }
    };

    return (
        <div className="container-fluid px-0 px-md-3">
            {/* Header Responsive */}
            <div className="page-header-wrapper d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-4">
                <div>
                    <h2 className="page-title mb-1">Quản lý Tin tức</h2>
                    <p className="page-subtitle mb-0">Danh sách bài viết từ các khoa và phòng ban</p>
                </div>
                <div className="d-flex gap-2">
                    <button onClick={handleExport} className="btn btn-outline-success">
                        <i className="fa-solid fa-file-excel me-2"></i> Xuất Excel
                    </button>
                    <Link to="/admin/posts/add" className="btn-primary-custom text-center text-decoration-none">
                        <i className="fa-solid fa-plus me-2"></i> Viết bài mới
                    </Link>
                </div>
            </div>

            {/* Toolbar Filter */}
            <div className="crud-toolbar mb-3 d-flex flex-column flex-md-row gap-3">
                <div className="search-box-wrapper w-100 w-md-auto flex-grow-1" style={{ maxWidth: '100%' }}>
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        className="form-control-search w-100"
                        placeholder="Tìm kiếm tiêu đề..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select
                    className="form-select-filter w-100 w-md-auto"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="Published">Đã đăng</option>
                    <option value="Pending">Chờ duyệt</option>
                    <option value="Draft">Bản nháp</option>
                    <option value="Rejected">Bị trả về</option>
                </select>

                <select
                    className="form-select-filter w-100 w-md-auto"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">Tất cả danh mục</option>
                    {categories.map(c => (
                        <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                    ))}
                </select>
            </div>

            <div className="table-card">
                <div className="table-responsive">
                    <table className="custom-table table table-hover mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="d-none d-md-table-cell" style={{ width: '60px' }}>Ảnh</th>
                                <th>Tiêu đề</th>
                                <th className="d-none d-lg-table-cell">Phân loại</th>
                                <th className="d-none d-lg-table-cell">Tác giả</th>
                                <th className="d-none d-md-table-cell">Trạng thái</th>
                                <th className="text-end" style={{ minWidth: '100px' }}>Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" className="text-center py-5"><div className="spinner-border text-primary"></div></td></tr>
                            ) : posts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-state text-center py-5">
                                        <i className="fa-solid fa-magnifying-glass-minus fa-2x mb-3 text-muted opacity-25"></i>
                                        <p className="text-muted">Không tìm thấy bài viết nào</p>
                                    </td>
                                </tr>
                            ) : (
                                posts.map((post) => (
                                    <tr key={post.postId}>
                                        <td className="d-none d-md-table-cell">
                                            <img src={post.thumbnail || "https://placehold.co/50x50"}
                                                className="rounded border"
                                                style={{ width: '50px', height: '40px', objectFit: 'cover' }}
                                                alt="Thumb"
                                            />
                                        </td>
                                        <td style={{ maxWidth: '300px' }}>
                                            <div className="fw-bold text-dark text-break" title={post.title}>
                                                {post.title}
                                            </div>

                                            <div className="d-lg-none mt-1">
                                                <span className="badge bg-light text-dark border me-1">{post.categoryName}</span>
                                                {renderStatusBadge(post.status)}
                                            </div>

                                            <div className="small text-muted mt-1">
                                                <i className="fa-regular fa-eye me-1"></i>{post.viewCount}
                                                <span className="mx-2 d-none d-sm-inline">•</span>
                                                <span className="d-block d-sm-inline">
                                                    {post.createdAt ? new Date(post.createdAt).toLocaleDateString('vi-VN') : ''}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="d-none d-lg-table-cell">
                                            <div className="badge bg-light text-dark border mb-1">{post.categoryName}</div>
                                            <div className="small text-muted">{post.facultyName}</div>
                                        </td>
                                        <td className="d-none d-lg-table-cell"><span className="fw-medium">{post.authorName}</span></td>
                                        <td className="d-none d-md-table-cell">
                                            {renderStatusBadge(post.status)}
                                        </td>
                                        <td className="text-end">
                                            <div className="d-flex justify-content-end gap-2">
                                                {post.status === "Pending" && (role === "Admin" || role === "FacultyAdmin") && (
                                                    <>
                                                        <button onClick={() => handleApprove(post.postId)} className="action-btn text-success border-success" title="Duyệt bài">
                                                            <i className="fa-solid fa-check"></i>
                                                        </button>
                                                        <button onClick={() => { setRejectId(post.postId); setIsRejectModalOpen(true); }} className="action-btn text-danger border-danger" title="Từ chối">
                                                            <i className="fa-solid fa-xmark"></i>
                                                        </button>
                                                    </>
                                                )}
                                                <Link to={`/admin/posts/edit/${post.postId}`} className="action-btn btn-edit" title="Chỉnh sửa">
                                                    <i className="fa-solid fa-pen"></i>
                                                </Link>
                                                <button onClick={() => handleDeleteClick(post.postId)} className="action-btn btn-delete" title="Xóa">
                                                    <i className="fa-regular fa-trash-can"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <ConfirmModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleConfirmDelete} title="Xóa bài viết?" />

            {/* Modal Từ chối bài viết */}
            {isRejectModalOpen && (
                <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-danger text-white">
                                <h5 className="modal-title"><i className="fa-solid fa-ban me-2"></i>Từ chối bài viết</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setIsRejectModalOpen(false)}></button>
                            </div>
                            <div className="modal-body p-4">
                                <label className="form-label-custom mb-2">Lý do từ chối <span className="text-danger">*</span></label>
                                <textarea
                                    className="form-control-modern"
                                    rows="4"
                                    placeholder="Vui lòng nhập lý do để giảng viên biết đường mà sửa..."
                                    value={rejectComment}
                                    onChange={(e) => setRejectComment(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="modal-footer border-0 p-3">
                                <button type="button" className="btn btn-light px-4" onClick={() => setIsRejectModalOpen(false)}>Hủy</button>
                                <button type="button" className="btn btn-danger px-4" onClick={handleReject}>Gửi phản hồi</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export default PostsPage;