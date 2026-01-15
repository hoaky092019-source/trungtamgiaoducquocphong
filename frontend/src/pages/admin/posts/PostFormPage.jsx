import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import postService from '../../../services/postService';
import categoryService from '../../../services/categoryService';
import facultyService from '../../../services/facultyService';

// --- IMPORT CKEDITOR 4 ---
import { CKEditor } from 'ckeditor4-react';

const PostFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [categories, setCategories] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [loading, setLoading] = useState(isEdit); // Trạng thái loading

    // --- CẤU HÌNH UPLOAD ẢNH CHO CKEDITOR ---
    // 1. Lấy token từ localStorage (để backend biết ai đang upload)
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const token = user ? user.token : '';
    const role = user ? user.roleName : 'Teacher';

    // 2. Đường dẫn API Upload (Đổi port 5076 nếu backend chạy port khác)
    const UPLOAD_URL = `http://localhost:5076/api/upload/image-ck4?token=${token}`;

    const [formData, setFormData] = useState({
        title: "",
        categoryId: "",
        facultyId: "",
        content: "",
        status: "Draft",
        thumbnail: "",
        approvalComment: "",
        approverName: ""
    });

    useEffect(() => {
        // Load danh mục & Khoa
        categoryService.getAll().then(data => setCategories(data)).catch(console.error);
        facultyService.getAll().then(data => setFaculties(data)).catch(console.error);

        // Nếu là Edit -> Load dữ liệu cũ
        if (isEdit) {
            postService.getById(id)
                .then(data => {
                    setFormData({
                        title: data.title,
                        categoryId: data.categoryId || "",
                        facultyId: data.facultyId || "",
                        content: data.content || "", // Nội dung HTML
                        status: data.status || "Draft",
                        thumbnail: data.thumbnail || "",
                        approvalComment: data.approvalComment || "",
                        approverName: data.approverName || ""
                    });
                })
                .catch(err => console.error("Lỗi load bài viết:", err))
                .finally(() => setLoading(false)); // Tắt loading khi xong
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // --- HÀM XỬ LÝ KHI NGƯỜI DÙNG GÕ VÀO CKEDITOR ---
    const onEditorChange = (evt) => {
        setFormData(prev => ({
            ...prev,
            content: evt.editor.getData() // Lấy HTML từ editor
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
                facultyId: formData.facultyId ? parseInt(formData.facultyId) : null
            };

            if (isEdit) {
                await postService.update(id, payload);
                toast.success("Cập nhật thành công!");
            } else {
                await postService.create(payload);
                toast.success("Đăng bài thành công!");
            }
            navigate('/admin/posts');
        } catch (error) {
            toast.error("Lỗi: " + (error.response?.data?.message || "Có lỗi xảy ra"));
        }
    };

    return (
        <div className="container-fluid px-0 px-md-3">
            {/* Header Responsive */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center mb-4 gap-3">
                <h2 className="page-title mb-0">{isEdit ? "Chỉnh sửa bài viết" : "Viết bài mới"}</h2>
                <Link to="/admin/posts" className="btn btn-secondary-custom text-center text-decoration-none">
                    <i className="fa-solid fa-arrow-left me-2"></i> Quay lại
                </Link>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row g-4">

                    {/* CỘT TRÁI: Nội dung chính */}
                    <div className="col-12 col-lg-8">
                        <div className="form-card h-100">
                            <div className="mb-4">
                                <label className="form-label-custom">Tiêu đề <span className="text-danger">*</span></label>
                                <input
                                    type="text" name="title" className="form-control-modern fw-bold"
                                    value={formData.title} onChange={handleChange} required
                                    placeholder="Nhập tiêu đề bài viết..."
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label-custom mb-2">Nội dung chi tiết</label>

                                {/* --- KHUNG SOẠN THẢO CKEDITOR 4 --- */}
                                {/* Chỉ render Editor khi đã load xong dữ liệu (nếu là Edit) */}
                                {!loading && (
                                    <CKEditor
                                        initData={formData.content} // Dữ liệu ban đầu
                                        // data={formData.content}  <-- BỎ DÒNG NÀY ĐỂ TRÁNH RESET CON TRỎ
                                        onChange={onEditorChange}   // Sự kiện thay đổi
                                        config={{
                                            height: 500, // Chiều cao editor

                                            // CẤU HÌNH UPLOAD
                                            filebrowserUploadUrl: UPLOAD_URL, // API Backend
                                            filebrowserUploadMethod: 'xhr',  // Dùng xhr để nhận JSON

                                            language: 'vi', // Tiếng Việt

                                            // THANH CÔNG CỤ (Full option)
                                            toolbar: [
                                                ['Source', '-', 'Maximize'],
                                                ['Undo', 'Redo', '-', 'Find', 'Replace', '-', 'SelectAll', 'RemoveFormat'],
                                                '/',
                                                ['Bold', 'Italic', 'Underline', 'Strike', '-', 'Subscript', 'Superscript'],
                                                ['Styles', 'Format', 'Font', 'FontSize'],
                                                ['TextColor', 'BGColor'],
                                                ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', 'Blockquote'],
                                                ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
                                                ['Link', 'Unlink', 'Anchor'],
                                                '/',
                                                ['Image', 'Table', 'HorizontalRule', 'SpecialChar']
                                            ],
                                            // Xóa dòng thông báo bản quyền dưới đáy
                                            removePlugins: 'elementspath',
                                            resize_enabled: false
                                        }}
                                    />
                                )}
                                {loading && <div className="text-center p-5">Đang tải trình soạn thảo...</div>}
                            </div>
                        </div>
                    </div>

                    {/* CỘT PHẢI: Setting */}
                    <div className="col-12 col-lg-4">
                        <div className="form-card">
                            <div className="form-section-title">Thiết lập bài viết</div>

                            <div className="mb-4">
                                <label className="form-label-custom">Chuyên mục</label>
                                <select name="categoryId" className="form-control-modern" value={formData.categoryId} onChange={handleChange}>
                                    <option value="">-- Tin tức chung --</option>
                                    {categories.map(c => (
                                        <option key={c.categoryId} value={c.categoryId}>{c.categoryName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="form-label-custom">Thuộc Khoa / Ban</label>
                                <select name="facultyId" className="form-control-modern" value={formData.facultyId} onChange={handleChange}>
                                    <option value="">-- Toàn trường --</option>
                                    {faculties.map(f => (
                                        <option key={f.facultyId} value={f.facultyId}>{f.facultyName}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="mb-4">
                                <label className="form-label-custom">Ảnh Thumbnail</label>
                                {/* Input File Upload */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="form-control mb-2"
                                    onChange={async (e) => {
                                        const file = e.target.files[0];
                                        if (!file) return;

                                        try {
                                            const res = await postService.uploadImage(file);
                                            // API trả về: { uploaded: 1, url: "..." }
                                            if (res.url) {
                                                setFormData(prev => ({ ...prev, thumbnail: res.url }));
                                            }
                                        } catch (err) {
                                            toast.error("Lỗi upload ảnh thumbnail");
                                            console.error(err);
                                        }
                                    }}
                                />

                                {/* Input Hidden để vẫn submit được URL */}
                                <input type="hidden" name="thumbnail" value={formData.thumbnail} />

                                {formData.thumbnail && (
                                    <div className="mt-2 p-1 border rounded bg-light text-center">
                                        <img src={formData.thumbnail} className="rounded" style={{ maxHeight: '150px', maxWidth: '100%', objectFit: 'contain' }} alt="Preview" />
                                        <div className="small text-muted mt-1 text-break">{formData.thumbnail}</div>
                                    </div>
                                )}
                            </div>

                            <div className="mb-4">
                                <label className="form-label-custom">Trạng thái</label>
                                <select name="status" className="form-control-modern" value={formData.status} onChange={handleChange}>
                                    {role === "Teacher" ? (
                                        <>
                                            <option value="Draft">Bản nháp (Draft)</option>
                                            <option value="Pending">Gửi phê duyệt (Pending)</option>
                                            {formData.status === "Rejected" && <option value="Rejected" disabled>Bị từ chối (Rejected)</option>}
                                            {formData.status === "Published" && <option value="Published" disabled>Đã đăng (Published)</option>}
                                        </>
                                    ) : (
                                        <>
                                            <option value="Draft">Bản nháp (Draft)</option>
                                            <option value="Pending">Chờ duyệt (Pending)</option>
                                            <option value="Published">Công khai (Published)</option>
                                            <option value="Rejected">Từ chối (Rejected)</option>
                                            <option value="Archived">Lưu trữ (Archived)</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            {formData.approvalComment && (
                                <div className="mb-4 p-3 border-start border-danger border-4 bg-soft-danger rounded">
                                    <div className="fw-bold text-danger mb-1"><i className="fa-solid fa-circle-exclamation me-1"></i> Phản hồi từ: {formData.approverName}</div>
                                    <div className="small text-dark">{formData.approvalComment}</div>
                                </div>
                            )}

                            <button type="submit" className="btn-save-custom w-100 py-2">
                                <i className="fa-solid fa-floppy-disk me-2"></i>
                                {role === "Teacher"
                                    ? (formData.status === "Pending" ? "Gửi phê duyệt" : "Lưu bài viết")
                                    : "Lưu dữ liệu"}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PostFormPage;