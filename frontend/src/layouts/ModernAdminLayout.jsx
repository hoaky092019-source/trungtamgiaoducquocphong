import React, { useEffect, useState } from 'react';
import { Link, useLocation, Outlet, Navigate } from 'react-router-dom';
import authService from '../services/authService';
import notificationService from '../services/notificationService';
import '../css/ModernAdmin.css';

const ModernAdminLayout = () => {
    const location = useLocation();

    // Khởi tạo state user ngay lập tức
    const [user] = useState(() => authService.getCurrentUser());
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isStudentMenuOpen, setIsStudentMenuOpen] = useState(false);

    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [showNotifications, setShowNotifications] = useState(false);

    const isAuthenticated = user;

    // Tự động đóng sidebar khi chuyển trang (trên mobile)
    useEffect(() => {
        setIsSidebarOpen(false);
    }, [location]);

    // Fetch Notifications on mount
    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications();
        }
    }, [isAuthenticated]);

    const fetchNotifications = async () => {
        try {
            const res = await notificationService.getMyNotifications();
            // Bởi vì axiosClient đã return response.data, nên res lúc này chính là { notifications, unreadCount }
            if (res) {
                setNotifications(res.notifications || []);
                setUnreadCount(res.unreadCount || 0);
            }
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    const handleMarkAsRead = async (id, link) => {
        try {
            await notificationService.markAsRead(id);
            // Update UI locally
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));

            if (link) window.location.href = link;
        } catch (error) {
            console.error(error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (error) {
            console.error(error);
        }
    };

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    const isActive = (path) => location.pathname.includes(path) ? 'active' : '';

    const handleLogout = (e) => {
        e.preventDefault();
        authService.logout();
    };

    // Helper for Menu Permissions
    // Dùng authService.hasPermission để check.
    // Nếu user là Admin thì luôn true (đã xử lý trong authService).

    return (
        <div className={`modern-admin-wrapper ${isSidebarOpen ? 'sidebar-open' : ''}`}>

            {/* --- OVERLAY --- */}
            <div
                className={`admin-overlay ${isSidebarOpen ? 'show' : ''}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* --- SIDEBAR TRÁI --- */}
            <aside className={`modern-sidebar ${isSidebarOpen ? 'open' : ''}`}>

                {/* --- LOGO --- */}
                <div className="brand-logo" style={{ padding: '0', justifyContent: 'space-between' }}>
                    <img
                        src="/img/logottgdqp.png"
                        alt="Admin Logo"
                        style={{ height: '65px', objectFit: 'contain', maxWidth: '180px' }}
                    />
                    <button className="btn-close-sidebar d-lg-none" onClick={() => setIsSidebarOpen(false)}>
                        <i className="fa-solid fa-xmark"></i>
                    </button>
                </div>

                <div className="menu-label mt-3">Overview</div>
                <Link to="/admin/dashboard" className={`nav-link-modern ${isActive('/admin/dashboard')}`}>
                    <i className="fa-solid fa-border-all"></i> Dashboard
                </Link>

                <div className="menu-label mt-4">Management</div>

                {/* MODULE: CỔNG TTĐT SINH VIÊN */}
                {(user.roleName === 'Admin' || user.roleName === 'SuperAdmin') && (
                    <div className="nav-item-group mb-2">
                        <a className={`nav-link-modern ${isStudentMenuOpen ? '' : 'collapsed'} d-flex justify-content-between align-items-center`}
                            onClick={(e) => { e.preventDefault(); setIsStudentMenuOpen(!isStudentMenuOpen); }}
                            href="#studentPortalMenu"
                            style={{ cursor: 'pointer' }}>
                            <span><i className="fa-solid fa-graduation-cap"></i> Cổng Sinh Viên</span>
                            <i className={`fa-solid fa-chevron-down small ${isStudentMenuOpen ? 'fa-rotate-180' : ''}`} style={{ transition: 'transform 0.2s' }}></i>
                        </a>
                        <div id="studentPortalMenu" style={{ display: isStudentMenuOpen ? 'block' : 'none' }}>
                            <ul className="list-unstyled ps-3 pe-2 py-1 bg-light rounded m-2 mt-0">
                                <li>
                                    <Link to="/admin/schools" className={`nav-link-modern small ${isActive('/admin/schools')}`}>
                                        <i className="fa-solid fa-school me-2"></i> DS Trường
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/courses" className={`nav-link-modern small ${isActive('/admin/courses')}`}>
                                        <i className="fa-solid fa-layer-group me-2"></i> DS Khóa học
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/students" className={`nav-link-modern small ${isActive('/admin/students')}`}>
                                        <i className="fa-solid fa-users me-2"></i> DS Sinh viên
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/admin/schedules" className={`nav-link-modern small ${isActive('/admin/schedules')}`}>
                                        <i className="fa-regular fa-calendar-days me-2"></i> Lịch học tập
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                )}

                {(user.roleName === 'Admin' || user.roleName === 'SuperAdmin') && (
                    <Link to="/admin/units" className={`nav-link-modern ${isActive('/admin/units')}`}>
                        <i className="fa-solid fa-sitemap"></i> Quản lý Đơn vị
                    </Link>
                )}

                {(authService.hasPermission('manage_posts') || user.roleName === 'Teacher' || user.roleName === 'FacultyAdmin') && (
                    <Link to="/admin/posts" className={`nav-link-modern ${isActive('/admin/posts')}`}>
                        <i className="fa-solid fa-book-open"></i> Quản lý bài viết
                    </Link>
                )}

                {(authService.hasPermission('manage_files') || user.roleName === 'Teacher' || user.roleName === 'FacultyAdmin') && (
                    <Link to="/admin/file-manager" className={`nav-link-modern ${isActive('/admin/file-manager')}`}>
                        <i className="fa-solid fa-folder-tree"></i> Quản lý File
                    </Link>
                )}

                {authService.hasPermission('manage_categories') && (
                    <Link to="/admin/categories" className={`nav-link-modern ${isActive('/admin/categories')}`}>
                        <i className="fa-solid fa-layer-group"></i> Danh mục
                    </Link>
                )}

                {authService.hasPermission('manage_faculties') && (
                    <Link to="/admin/faculties" className={`nav-link-modern ${isActive('/admin/faculties')}`}>
                        <i className="fa-solid fa-building"></i> Khoa/Phòng
                    </Link>
                )}

                {authService.hasPermission('manage_users') && (
                    <Link to="/admin/users" className={`nav-link-modern ${isActive('/admin/users')}`}>
                        <i className="fa-regular fa-user"></i> Quản trị người dùng
                    </Link>
                )}

                <div className="menu-label mt-4">Settings</div>

                {authService.hasPermission('manage_settings') && (
                    <Link to="/admin/settings" className="nav-link-modern">
                        <i className="fa-solid fa-gear"></i> Cấu hình
                    </Link>
                )}

                <div className="sidebar-bottom">
                    <a href="/login" onClick={handleLogout} className="nav-link-modern" style={{ color: '#FF754C' }}>
                        <i className="fa-solid fa-arrow-right-from-bracket"></i> Đăng xuất
                    </a>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="modern-content">
                <div className="modern-header">
                    <div className="d-flex align-items-center gap-3">
                        <button
                            className="btn-toggle-sidebar d-lg-none"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <i className="fa-solid fa-bars"></i>
                        </button>

                        <div className="search-bar">
                            <i className="fa-solid fa-magnifying-glass"></i>
                            <input type="text" placeholder="Tìm kiếm..." />
                        </div>
                    </div>

                    <div className="header-actions">
                        {/* Messages (Placeholder) */}
                        <div className="icon-btn">
                            <i className="fa-regular fa-envelope"></i>
                        </div>

                        {/* Notifications */}
                        <div className="icon-btn" style={{ position: 'relative' }} onClick={() => setShowNotifications(!showNotifications)}>
                            <i className="fa-regular fa-bell"></i>
                            {unreadCount > 0 && <div className="badge-dot"></div>}

                            {/* Dropdown */}
                            {showNotifications && (
                                <div className="notification-dropdown" style={{
                                    position: 'absolute',
                                    top: '40px',
                                    right: '0',
                                    width: '320px',
                                    backgroundColor: '#fff',
                                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                                    borderRadius: '8px',
                                    zIndex: 1000,
                                    padding: '10px 0',
                                    cursor: 'default'
                                }} onClick={e => e.stopPropagation()}>
                                    <div className="d-flex justify-content-between px-3 pb-2 border-bottom">
                                        <h6 className="m-0 fw-bold">Thông báo</h6>
                                        <small className="text-primary cursor-pointer" style={{ cursor: 'pointer' }} onClick={handleMarkAllRead}>Đọc tất cả</small>
                                    </div>
                                    <div className="notification-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {notifications.length === 0 ? (
                                            <p className="text-center text-muted my-3">Không có thông báo mới</p>
                                        ) : (
                                            notifications.map(n => (
                                                <div key={n.id}
                                                    className={`notification-item px-3 py-2 border-bottom ${n.isRead ? '' : 'bg-light'}`}
                                                    style={{ cursor: 'pointer', transition: 'background 0.2s' }}
                                                    onClick={() => handleMarkAsRead(n.id, n.link)}
                                                >
                                                    <div className="d-flex justify-content-between">
                                                        <strong style={{ fontSize: '0.9rem' }}>{n.title}</strong>
                                                        <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                            {new Date(n.createdAt).toLocaleDateString()}
                                                        </small>
                                                    </div>
                                                    <p className="m-0 text-muted" style={{ fontSize: '0.85rem' }}>{n.message}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                    <div className="text-center pt-2">
                                        <small className="text-primary" style={{ cursor: 'pointer' }}>Xem tất cả</small>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="user-profile">
                            <div className="text-end d-none d-md-block">
                                <small className="d-block text-muted">
                                    {user?.roleName || "Thành viên"}
                                </small>
                                <span className="fw-bold d-block" style={{ lineHeight: '1.2' }}>
                                    {user?.fullName || "Admin User"}
                                </span>
                                {user?.facultyName && (
                                    <small className="text-primary" style={{ fontSize: '0.75rem' }}>
                                        {user.facultyName}
                                    </small>
                                )}
                            </div>
                            <img
                                src={user?.avatar || "https://placehold.co/100x100"}
                                className="user-avatar"
                                alt="User"
                            />
                        </div>
                    </div>
                </div>

                <div className="page-content-dynamic">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default ModernAdminLayout;