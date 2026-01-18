import React, { useEffect } from 'react';
import { useNavigate, useLocation, Outlet, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const StudentLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Check auth
    useEffect(() => {
        const token = localStorage.getItem('studentToken');
        if (!token) {
            navigate('/danh-muc/cong-ttdt-sinh-vien');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentInfo');
        navigate('/danh-muc/cong-ttdt-sinh-vien');
    };

    return (
        <div className="d-flex flex-column min-vh-100 bg-light">
            <Navbar />

            {/* Student Header */}
            <div className="bg-primary text-white py-4">
                <div className="container d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="fw-bold mb-0"><i className="fa-solid fa-user-graduate me-2"></i> Cổng thông tin sinh viên</h2>
                        <p className="mb-0 opacity-75">Quản lý thông tin học tập & sinh hoạt</p>
                    </div>
                    <div>
                        <button onClick={handleLogout} className="btn btn-outline-light btn-sm">
                            <i className="fa-solid fa-right-from-bracket me-1"></i> Đăng xuất
                        </button>
                    </div>
                </div>
            </div>

            <div className="container my-4 flex-grow-1">
                <div className="row">
                    {/* Sidebar Navigation */}
                    <div className="col-lg-3 mb-4">
                        <div className="card shadow-sm border-0">
                            <div className="card-body p-2">
                                <div className="list-group list-group-flush">
                                    <Link to="/cong-thong-tin-sinh-vien/dashboard"
                                        className={`list-group-item list-group-item-action py-3 ${location.pathname === '/cong-thong-tin-sinh-vien/dashboard' ? 'active' : ''}`}>
                                        <i className="fa-solid fa-shirt me-2"></i> Đăng ký quân trang
                                    </Link>
                                    <Link to="/cong-thong-tin-sinh-vien/schedule"
                                        className={`list-group-item list-group-item-action py-3 ${location.pathname.includes('schedule') ? 'active' : ''}`}>
                                        <i className="fa-regular fa-calendar-days me-2"></i> Lịch học tập
                                    </Link>
                                    <Link to="/cong-thong-tin-sinh-vien/grades"
                                        className={`list-group-item list-group-item-action py-3 ${location.pathname.includes('grades') ? 'active' : ''}`}>
                                        <i className="fa-solid fa-chart-simple me-2"></i> Kết quả học tập
                                    </Link>
                                    <Link to="/cong-thong-tin-sinh-vien/info"
                                        className={`list-group-item list-group-item-action py-3 ${location.pathname.includes('info') ? 'active' : ''}`}>
                                        <i className="fa-solid fa-circle-info me-2"></i> Thông tin cá nhân
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-lg-9">
                        <Outlet />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default StudentLayout;
