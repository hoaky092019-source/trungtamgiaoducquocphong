// src/pages/admin/DashboardPage.jsx
import React, { useEffect, useState } from 'react';
import dashboardService from '../../../services/dashboardService';
import authService from '../../../services/authService';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalPosts: 0,
        pendingCount: 0,
        publishedCount: 0,
        totalUsers: 0,
        recentPending: []
    });
    const [loading, setLoading] = useState(true);
    const user = authService.getCurrentUser();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await dashboardService.getStats();
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch stats", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-grid">

            {/* --- CỘT TRÁI (NỘI DUNG CHÍNH) --- */}
            <div className="left-column">
                {/* Banner Tím */}
                <div className="hero-banner">
                    <small className="text-uppercase text-white-50 mb-2 d-block">Hệ thống quản trị</small>
                    <h2>Xin chào, {user?.fullName || "Người quản trị"}!<br />Nâng cao chất lượng Đào tạo</h2>
                    <Link to="/admin/posts/add" className="btn-join text-decoration-none">
                        <i className="fa-solid fa-plus me-2"></i> Viết bài mới
                    </Link>

                    {/* Trang trí sao (Optional) */}
                    <i className="fa-solid fa-star position-absolute text-white" style={{ top: '20px', right: '40px', opacity: 0.3, fontSize: '2rem' }}></i>
                    <i className="fa-solid fa-star position-absolute text-white" style={{ bottom: '40px', right: '100px', opacity: 0.5, fontSize: '1rem' }}></i>
                </div>

                {/* 3 Thẻ thống kê nhỏ */}
                <div className="stats-row">
                    <div className="stat-card-mini">
                        <div className="stat-icon bg-purple-light"><i className="fa-solid fa-copy"></i></div>
                        <div>
                            <h4 className="m-0 fw-bold">{stats.totalPosts}</h4>
                            <small className="text-muted">Tổng bài viết</small>
                        </div>
                    </div>
                    <div className="stat-card-mini">
                        <div className="stat-icon bg-orange-light"><i className="fa-solid fa-clock"></i></div>
                        <div>
                            <h4 className="m-0 fw-bold">{stats.pendingCount}</h4>
                            <small className="text-muted">Đang chờ duyệt</small>
                        </div>
                    </div>
                    <div className="stat-card-mini">
                        <div className="stat-icon bg-blue-light"><i className="fa-solid fa-check-double"></i></div>
                        <div>
                            <h4 className="m-0 fw-bold">{stats.publishedCount}</h4>
                            <small className="text-muted">Đã công khai</small>
                        </div>
                    </div>
                </div>

                {/* Danh sách bài viết gần đây */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold">
                        {user?.roleName === 'Teacher' ? "Bài viết chờ duyệt của bạn" : "Yêu cầu phê duyệt gần đây"}
                    </h5>
                    <Link to="/admin/posts" className="text-decoration-none" style={{ color: '#6C5DD3' }}>Xem tất cả</Link>
                </div>

                <div className="row g-3">
                    {stats.recentPending.length > 0 ? (
                        stats.recentPending.map((post) => (
                            <div className="col-md-6" key={post.postId}>
                                <Link to={`/admin/posts/edit/${post.postId}`} className="text-decoration-none">
                                    <div className="card border-0 shadow-sm p-3 h-100" style={{ borderRadius: '20px', transition: 'all 0.3s' }}>
                                        <div className="d-flex align-items-center">
                                            <img src={post.thumbnail || 'https://placehold.co/80x80'}
                                                className="rounded-3 me-3"
                                                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                alt="Thumb"
                                            />
                                            <div className="overflow-hidden">
                                                <h6 className="fw-bold mb-1 text-dark text-truncate">{post.title}</h6>
                                                <small className="text-muted d-block mb-1">Bởi: {post.authorName}</small>
                                                <span className="badge bg-warning text-dark" style={{ fontSize: '0.7rem' }}>Chờ duyệt</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="col-12 text-center py-4 bg-white rounded-4 shadow-sm">
                            <img src="https://cdn-icons-png.flaticon.com/512/7486/7486744.png" style={{ width: '60px', opacity: 0.5 }} className="mb-2" alt="Empty" />
                            <p className="text-muted m-0">Không có bài viết nào đang chờ duyệt</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- CỘT PHẢI (THỐNG KÊ & MENTOR) --- */}
            <div className="right-column">
                <div className="right-sidebar-panel mb-4">
                    <h5 className="fw-bold mb-4">Hoạt động</h5>
                    <div className="text-center p-3">
                        <h1 className="display-4 fw-bold text-primary">{stats.publishedCount}</h1>
                        <p className="text-muted">Bài viết đã được xuất bản thành công</p>
                        <div className="progress" style={{ height: '10px', borderRadius: '10px' }}>
                            <div className="progress-bar bg-primary" style={{ width: stats.totalPosts > 0 ? `${(stats.publishedCount / stats.totalPosts) * 100}%` : '0%' }}></div>
                        </div>
                    </div>
                </div>

                {user?.roleName === 'Admin' && (
                    <div className="right-sidebar-panel">
                        <div className="d-flex justify-content-between mb-3">
                            <h5 className="fw-bold">Hệ thống</h5>
                        </div>
                        <div className="d-flex align-items-center p-3 mb-2 bg-light rounded-4">
                            <div className="bg-white p-2 rounded-circle me-3 shadow-sm">
                                <i className="fa-solid fa-users text-primary"></i>
                            </div>
                            <div>
                                <h6 className="m-0 fw-bold">{stats.totalUsers}</h6>
                                <small className="text-muted">Tổng người dùng</small>
                            </div>
                        </div>
                        <Link to="/admin/users" className="btn btn-outline-primary w-100 rounded-pill mt-3">Quản lý người dùng</Link>
                    </div>
                )}

                {user?.roleName !== 'Admin' && (
                    <div className="right-sidebar-panel">
                        <h5 className="fw-bold mb-3">Trợ giúp</h5>
                        <p className="small text-muted">Nếu bạn có khó khăn trong việc đăng bài hoặc phê duyệt, vui lòng liên hệ bộ phận kỹ thuật.</p>
                        <button className="btn btn-primary w-100 rounded-pill">Gửi hỗ trợ</button>
                    </div>
                )}
            </div>

        </div>
    );
};

export default DashboardPage;