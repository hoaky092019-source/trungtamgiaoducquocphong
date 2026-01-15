import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import categoryService from '../../../services/categoryService';

const CategoryFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const [categories, setCategories] = useState([]);

    const [formData, setFormData] = useState({
        categoryName: '',
        description: '',
        parentCategoryId: ''
    });

    useEffect(() => {
        categoryService.getAll().then(data => {
            if (isEdit) {
                setCategories(data.filter(c => c.categoryId !== parseInt(id)));
            } else {
                setCategories(data);
            }
        });

        if (isEdit) {
            categoryService.getById(id).then(data => setFormData({
                categoryName: data.categoryName,
                description: data.description || '',
                parentCategoryId: data.parentCategoryId || ''
            })).catch(err => console.error(err));
        }
    }, [id, isEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                parentCategoryId: formData.parentCategoryId ? parseInt(formData.parentCategoryId) : null
            };

            const res = isEdit
                ? await categoryService.update(id, payload)
                : await categoryService.create(payload);

            toast.success(res.message || (isEdit ? "Cập nhật thành công!" : "Thêm mới thành công!"));
            navigate('/admin/categories');
        } catch (error) {
            toast.error("Lỗi: " + (error.response?.data?.message || "Lỗi lưu dữ liệu"));
        }
    };

    return (
        <div className="container-fluid px-0 px-md-3">
            {/* Header Form: Stack dọc trên mobile */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
                <h2 className="page-title mb-0">{isEdit ? 'Cập nhật Danh mục' : 'Thêm Danh mục mới'}</h2>
                <Link to="/admin/categories" className="btn btn-secondary-custom w-100 w-md-auto text-center">
                    <i className="fa-solid fa-arrow-left me-2"></i> Quay lại
                </Link>
            </div>

            <div className="row justify-content-center">
                {/* Reposive Grid: col-12 (full mobile) -> col-md-8 (tablet) -> col-lg-6 (PC) */}
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="form-card">
                        <form onSubmit={handleSubmit}>
                            <div className="form-section-title">Thông tin danh mục</div>

                            <div className="mb-4">
                                <label className="form-label-custom">Tên Danh mục <span className="text-danger">*</span></label>
                                <input type="text" className="form-control-modern"
                                    value={formData.categoryName}
                                    onChange={e => setFormData({ ...formData, categoryName: e.target.value })}
                                    required
                                    placeholder="Ví dụ: Tin hoạt động"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label-custom">Danh mục Cha</label>
                                <select
                                    className="form-control-modern"
                                    value={formData.parentCategoryId}
                                    onChange={e => setFormData({ ...formData, parentCategoryId: e.target.value })}
                                >
                                    <option value="">-- Là danh mục gốc --</option>
                                    {categories.map(c => (
                                        <option key={c.categoryId} value={c.categoryId}>
                                            {c.categoryName}
                                        </option>
                                    ))}
                                </select>
                                <small className="text-muted d-block mt-1">Chọn danh mục cấp trên nếu đây là danh mục con.</small>
                            </div>

                            <div className="mb-4">
                                <label className="form-label-custom">Mô tả</label>
                                <textarea className="form-control-modern" rows="4"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Mô tả ngắn gọn về danh mục này..."
                                ></textarea>
                            </div>

                            <div className="form-footer">
                                <button type="submit" className="btn-save-custom w-100 w-md-auto">
                                    <i className="fa-solid fa-save me-2"></i> Lưu dữ liệu
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryFormPage;