import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import facultyService from '../../../services/facultyService';

const FacultyFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState({
        facultyName: '',
        description: ''
    });

    useEffect(() => {
        if (isEdit) {
            facultyService.getById(id).then(data => {
                setFormData({
                    facultyName: data.facultyName,
                    description: data.description || ''
                });
            }).catch(err => alert("Lỗi tải thông tin khoa"));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await facultyService.update(id, formData);
                toast.success("Cập nhật khoa thành công!");
            } else {
                await facultyService.create(formData);
                toast.success("Thêm khoa mới thành công!");
            }
            navigate('/admin/faculties');
        } catch (error) {
            toast.error("Có lỗi xảy ra khi lưu!");
        }
    };

    return (
        <div className="container-fluid px-0 px-md-3">
            {/* Header Form: Responsive */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="page-title mb-0">{isEdit ? 'Cập nhật Thông tin Khoa' : 'Thêm Khoa / Phòng mới'}</h2>
                </div>
                <Link to="/admin/faculties" className="btn btn-secondary-custom text-center text-decoration-none">
                    <i className="fa-solid fa-arrow-left me-2"></i> Danh sách
                </Link>
            </div>

            {/* Form Card */}
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8">
                    <div className="form-card">
                        <form onSubmit={handleSubmit}>

                            <div className="form-section-title">
                                <i className="fa-solid fa-school me-2"></i>Thông tin chung
                            </div>

                            <div className="mb-4">
                                <label className="form-label-custom">Tên Khoa / Phòng <span className="text-danger">*</span></label>
                                <input
                                    type="text"
                                    className="form-control-modern"
                                    name="facultyName"
                                    value={formData.facultyName}
                                    onChange={handleChange}
                                    placeholder="Ví dụ: Khoa Công nghệ thông tin"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label className="form-label-custom">Mô tả / Chức năng nhiệm vụ</label>
                                <textarea
                                    className="form-control-modern"
                                    name="description"
                                    rows="5"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Nhập mô tả ngắn gọn về chức năng của khoa..."
                                ></textarea>
                            </div>

                            <div className="form-footer d-flex flex-column flex-md-row justify-content-end gap-2">
                                <button type="button" onClick={() => navigate('/admin/faculties')} className="btn-secondary-custom w-100 w-md-auto order-1 order-md-0">
                                    Hủy
                                </button>
                                <button type="submit" className="btn-save-custom w-100 w-md-auto order-0 order-md-1">
                                    <i className="fa-solid fa-check me-2"></i>
                                    {isEdit ? 'Cập nhật' : 'Thêm mới'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FacultyFormPage;