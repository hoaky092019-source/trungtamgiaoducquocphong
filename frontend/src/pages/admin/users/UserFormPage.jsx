import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import userService from '../../../services/userService';
import facultyService from '../../../services/facultyService';

const UserFormPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);

    const [faculties, setFaculties] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        fullName: '',
        email: '',
        phone: '',
        roleId: 2,
        facultyId: '',
        status: true
    });

    useEffect(() => {
        facultyService.getAll().then(data => setFaculties(data));

        if (isEdit) {
            userService.getById(id).then(data => {
                setFormData({
                    ...data,
                    password: '',
                    facultyId: data.facultyId || ''
                });
            }).catch(err => toast.error("Lỗi tải thông tin user"));
        }
    }, [id, isEdit]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            roleId: parseInt(formData.roleId),
            facultyId: formData.facultyId ? parseInt(formData.facultyId) : null,
            status: formData.status
        };

        if (!isEdit) {
            payload.username = formData.username;
            payload.password = formData.password;
        }

        try {
            if (isEdit) {
                await userService.update(id, payload);
                toast.success("Cập nhật thành công!");
            } else {
                await userService.create(payload);
                toast.success("Thêm mới thành công!");
            }
            navigate('/admin/users');
        } catch (error) {
            toast.error("Lỗi: " + (error.response?.data?.message || "Có lỗi xảy ra"));
        }
    };

    return (
        <div className="container-fluid px-0 px-md-3">
            {/* Header Responsive */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center mb-4 gap-3">
                <div>
                    <h2 className="page-title mb-0">{isEdit ? 'Cập nhật Người dùng' : 'Thêm Người dùng mới'}</h2>
                    <p className="page-subtitle mb-0">Điền đầy đủ thông tin bên dưới</p>
                </div>
                <Link to="/admin/users" className="btn btn-secondary-custom text-center text-decoration-none">
                    <i className="fa-solid fa-arrow-left me-2"></i> Quay lại
                </Link>
            </div>

            {/* Form Card */}
            <div className="row justify-content-center">
                <div className="col-12 col-xl-10"> {/* Rộng hơn chút trên màn hình lớn */}
                    <div className="form-card">
                        <form onSubmit={handleSubmit}>

                            <div className="form-section-title">
                                <i className="fa-regular fa-id-card me-2"></i>Thông tin tài khoản
                            </div>

                            <div className="row">
                                <div className="col-12 col-md-6 mb-3">
                                    <label className="form-label-custom">Tên đăng nhập <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control-modern"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        disabled={isEdit}
                                        placeholder="VD: nguyenvanA"
                                        required
                                    />
                                    {isEdit && <small className="text-muted fst-italic">Tên đăng nhập không thể thay đổi</small>}
                                </div>

                                {!isEdit && (
                                    <div className="col-12 col-md-6 mb-3">
                                        <label className="form-label-custom">Mật khẩu <span className="text-danger">*</span></label>
                                        <input
                                            type="password"
                                            className="form-control-modern"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Nhập mật khẩu..."
                                            required
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="form-section-title mt-4">
                                <i className="fa-regular fa-user me-2"></i>Thông tin cá nhân & Phân quyền
                            </div>

                            <div className="row">
                                <div className="col-12 col-md-6 mb-3">
                                    <label className="form-label-custom">Họ và tên <span className="text-danger">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control-modern"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="VD: Nguyễn Văn A"
                                        required
                                    />
                                </div>

                                <div className="col-12 col-md-6 mb-3">
                                    <label className="form-label-custom">Email liên hệ</label>
                                    <input
                                        type="email"
                                        className="form-control-modern"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="example@school.edu.vn"
                                    />
                                </div>

                                <div className="col-12 col-md-6 mb-3">
                                    <label className="form-label-custom">Số điện thoại</label>
                                    <input
                                        type="text"
                                        className="form-control-modern"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="col-12 col-md-6 mb-3">
                                    <label className="form-label-custom">Vai trò hệ thống</label>
                                    <select className="form-control-modern" name="roleId" value={formData.roleId} onChange={handleChange}>
                                        <option value="1">Admin (Quản trị hệ thống)</option>
                                        <option value="2">FacultyAdmin (Quản lý Khoa)</option>
                                        <option value="3">Teacher (Giảng viên)</option>
                                        <option value="4">Student (Học viên)</option>
                                    </select>
                                </div>

                                <div className="col-12 col-md-6 mb-3">
                                    <label className="form-label-custom">Thuộc Khoa / Ban</label>
                                    <select className="form-control-modern" name="facultyId" value={formData.facultyId} onChange={handleChange}>
                                        <option value="">-- Chọn Khoa / Ban --</option>
                                        {faculties.map(f => (
                                            <option key={f.facultyId} value={f.facultyId}>{f.facultyName}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {isEdit && (
                                <>
                                    <div className="form-section-title mt-4">
                                        <i className="fa-solid fa-toggle-on me-2"></i>Trạng thái
                                    </div>
                                    <div className="toggle-switch-wrapper d-flex align-items-center gap-2">
                                        <input
                                            type="checkbox"
                                            className="form-check-input-custom"
                                            id="statusCheck"
                                            name="status"
                                            checked={formData.status}
                                            onChange={handleChange}
                                            style={{ width: '20px', height: '20px' }}
                                        />
                                        <label className="form-label-custom mb-0 cursor-pointer fw-bold" htmlFor="statusCheck">
                                            {formData.status ? <span className="text-success">Đang hoạt động</span> : <span className="text-danger">Đang bị khóa</span>}
                                        </label>
                                    </div>
                                </>
                            )}

                            {/* Footer Buttons Responsive */}
                            <div className="form-footer mt-4 d-flex flex-column flex-md-row justify-content-end gap-2">
                                <button type="button" onClick={() => navigate('/admin/users')} className="btn-secondary-custom w-100 w-md-auto order-1 order-md-0">Hủy bỏ</button>
                                <button type="submit" className="btn-save-custom w-100 w-md-auto order-0 order-md-1">
                                    <i className="fa-solid fa-save me-2"></i>{isEdit ? 'Lưu thay đổi' : 'Tạo người dùng'}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserFormPage;