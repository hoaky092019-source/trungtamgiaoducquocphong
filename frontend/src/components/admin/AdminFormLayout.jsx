// src/components/admin/AdminFormLayout.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ModernAdminLayout from '../../layouts/ModernAdminLayout';
import '../../css/AdminForm.css'; // Import CSS form chuẩn

/**
 * @param {string} title - Tiêu đề trang (VD: Thêm người dùng)
 * @param {string} backLink - Đường dẫn nút quay lại (VD: /admin/users)
 * @param {function} onSave - Hàm xử lý khi bấm Lưu
 * @param {boolean} isEdit - Nếu là true thì nút sẽ hiện "Cập nhật", false hiện "Thêm mới"
 * @param {ReactNode} children - Các ô input form
 */
const AdminFormLayout = ({ title, backLink, onSave, isEdit = false, children }) => {
    const navigate = useNavigate();

    return (
        <ModernAdminLayout>
            {/* Header: Nút Back + Tiêu đề */}
            <div className="d-flex align-items-center mb-4">
                <Link to={backLink} className="btn btn-light rounded-circle me-3 shadow-sm" style={{width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <i className="fa-solid fa-arrow-left text-secondary"></i>
                </Link>
                <h2 className="page-header-title m-0">{title}</h2>
            </div>

            {/* Form Card Container */}
            <div className="bg-white rounded-4 shadow-sm p-4 p-md-5">
                <form onSubmit={(e) => { e.preventDefault(); onSave(); }}>
                    
                    {/* KHU VỰC CHỨA INPUT (Sẽ thay đổi tùy trang) */}
                    <div className="row g-4">
                        {children}
                    </div>

                    {/* Footer: Các nút hành động */}
                    <div className="d-flex justify-content-end gap-3 mt-5 pt-4 border-top">
                        <button 
                            type="button" 
                            className="btn btn-light px-4 py-2 fw-bold text-secondary"
                            onClick={() => navigate(backLink)}
                        >
                            Hủy bỏ
                        </button>
                        <button 
                            type="submit" 
                            className="btn btn-primary px-5 py-2 fw-bold shadow-sm"
                            style={{backgroundColor: 'var(--primary-color)', border: 'none'}}
                        >
                            <i className="fa-regular fa-floppy-disk me-2"></i>
                            {isEdit ? 'Cập nhật' : 'Lưu lại'}
                        </button>
                    </div>
                </form>
            </div>
        </ModernAdminLayout>
    );
};

export default AdminFormLayout;