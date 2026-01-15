import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../../services/authService';
import './LoginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    
    // State lưu dữ liệu nhập
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    // State lưu thông báo lỗi
    const [errorMsg, setErrorMsg] = useState('');
    // State loading
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setLoading(true);

        try {
            // Gọi API
            await authService.login(credentials.username, credentials.password);
            
            // Chuyển hướng vào Admin
            navigate('/admin/dashboard');

        } catch (error) {
            setErrorMsg(error.message || "Tên đăng nhập hoặc mật khẩu không đúng!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card shadow-lg">
                <div className="login-header text-center">
                    <img 
                        src="/img/logottgdqp.png" 
                        alt="Logo TTGDQP&AN" 
                        className="school-logo"
                        style={{ height: '100%', objectFit: 'contain', width: '100%' }}
                    />
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Hiển thị lỗi nếu có */}
                    {errorMsg && (
                        <div className="alert alert-danger text-center p-2 mb-3 small border-0 bg-danger text-white">
                            <i className="fa-solid fa-triangle-exclamation me-2"></i>{errorMsg}
                        </div>
                    )}

                    <div className="form-group mb-3">
                        <label className="fw-bold mb-1 text-secondary small">Tên đăng nhập</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light"><i className="fa-solid fa-user text-muted"></i></span>
                            <input 
                                type="text" 
                                className="form-control" 
                                name="username"
                                placeholder="Nhập tài khoản..." 
                                value={credentials.username}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    
                    <div className="form-group mb-4">
                        <label className="fw-bold mb-1 text-secondary small">Mật khẩu</label>
                        <div className="input-group">
                            <span className="input-group-text bg-light"><i className="fa-solid fa-lock text-muted"></i></span>
                            <input 
                                type="password" 
                                className="form-control" 
                                name="password"
                                placeholder="Nhập mật khẩu..." 
                                value={credentials.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100 fw-bold py-2 mb-3 shadow-sm" disabled={loading}>
                        {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="fa-solid fa-right-to-bracket me-2"></i>}
                        {loading ? 'Đang xử lý...' : 'ĐĂNG NHẬP HỆ THỐNG'}
                    </button>

                    {/* NÚT QUAY VỀ TRANG CHỦ */}
                    <div className="text-center">
                        <Link to="/" className="text-decoration-none text-secondary small hover-primary">
                            <i className="fa-solid fa-arrow-left me-1"></i> Quay về Trang chủ
                        </Link>
                    </div>
                </form>

                <hr className="my-4 text-muted opacity-25" />

                <div className="login-footer text-center">
                    <a href="#" className="text-decoration-none small text-muted me-3">Quên mật khẩu?</a>
                    <a href="#" className="text-decoration-none small text-muted">Hỗ trợ kỹ thuật</a>
                    <div className="mt-3 small text-muted opacity-75">Phiên bản 1.0.0 © 2025 EMSVN</div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;