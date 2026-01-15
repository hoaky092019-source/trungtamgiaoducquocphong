import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import categoryService from '../services/categoryService'; // Import service
import authService from '../services/authService';
import '../css/site.css';
import '../css/Footer.css';

const MainLayout = ({ children }) => {
    const location = useLocation();

    // --- STATE ---
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [user, setUser] = useState(null);
    const [menuTree, setMenuTree] = useState([]); // State lưu menu động

    // --- EFFECT ---
    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        // Load danh mục để làm Menu
        categoryService.getAll().then(cats => {
            // 1. Lọc lấy các danh mục cha (ParentCategoryId == null)
            // Lưu ý: Backend trả về có thể là null hoặc 0 tuỳ cấu hình, check cả 2
            const parents = cats.filter(c => !c.parentCategoryId);

            // 2. Map con vào cha
            const tree = parents.map(p => {
                return {
                    ...p,
                    children: cats.filter(c => c.parentCategoryId === p.categoryId)
                };
            });
            setMenuTree(tree);
        }).catch(console.error);

        const handleScroll = () => {
            const isScrolled = window.scrollY > 50;
            setScrolled(isScrolled);
            setShowBackToTop(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    // --- LOGIC ---
    const isActive = (path) => {
        if (path === '/') return location.pathname === '/' ? 'active' : '';
        return location.pathname.startsWith(path) ? 'active' : '';
    };

    const handleMouseEnter = (menuName) => {
        if (window.innerWidth >= 992) setActiveDropdown(menuName);
    };
    const handleMouseLeave = () => {
        if (window.innerWidth >= 992) setActiveDropdown(null);
    };
    const toggleDropdown = (e, menuName) => {
        e.preventDefault();
        setActiveDropdown(activeDropdown === menuName ? null : menuName);
    };
    const closeMenu = () => {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
    };
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* --- HEADER DUY NHẤT (STICKY) --- */}
            <header className="fixed-top">
                {/* navbar-light: Giúp nút toggler màu đen nổi trên nền trắng */}
                <nav className={`navbar navbar-expand-lg navbar-light navbar-custom ${scrolled ? 'navbar-scrolled' : ''}`}>
                    <div className="container">

                        {/* 1. LOGO LỚN (LUÔN HIỂN THỊ) */}
                        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeMenu}>
                            {/* Logo này sẽ tự co giãn theo CSS khi cuộn */}
                            <img
                                src="/img/logottgdqp.png"
                                alt="TTGDQP&AN Logo"
                            />
                        </Link>

                        {/* 2. KHU VỰC PHẢI: LOGIN + HAMBURGER (Luôn nằm phải) */}
                        <div className="d-flex align-items-center ms-auto order-lg-last">

                            {/* Nút Đăng nhập/Admin */}
                            <div className="me-2 me-lg-0 ms-3">
                                {user ? (
                                    <Link to="/admin/dashboard" className="btn btn-primary btn-sm fw-bold rounded-pill px-3 shadow-sm">
                                        <i className="fa-solid fa-user-shield me-lg-2"></i>
                                        <span className="d-none d-sm-inline">Quản trị</span>
                                    </Link>
                                ) : (
                                    /* Viền xanh, chữ xanh cho hợp nền trắng */
                                    <Link to="/login" className="btn btn-outline-primary btn-sm fw-bold rounded-pill px-3">
                                        <i className="fa-solid fa-circle-user me-lg-2"></i>
                                        <span className="d-none d-sm-inline">Đăng nhập</span>
                                    </Link>
                                )}
                            </div>

                            {/* Nút Hamburger */}
                            <button
                                className="navbar-toggler ms-2"
                                type="button"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                style={{ border: 'none', outline: 'none' }}
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                        </div>

                        {/* 3. MENU CHÍNH (Nằm giữa) */}
                        <div className={`collapse navbar-collapse order-lg-1 ${isMobileMenuOpen ? 'show' : ''}`} id="mainNav">
                            <ul className="navbar-nav mx-auto align-items-lg-center">
                                {/* Trang chủ (Cố định) */}
                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive('/')}`} to="/" onClick={closeMenu}>
                                        <i className="fa-solid fa-house me-1"></i> Trang chủ
                                    </Link>
                                </li>

                                {/* Giới thiệu (Cố định - Theo yêu cầu chưa cần động phần này hoặc làm sau) */}
                                <li className="nav-item dropdown" onMouseEnter={() => handleMouseEnter('gioi-thieu')} onMouseLeave={handleMouseLeave}>
                                    <a className={`nav-link dropdown-toggle ${isActive('/gioi-thieu')}`} href="#" onClick={(e) => toggleDropdown(e, 'gioi-thieu')}>
                                        Giới thiệu
                                    </a>
                                    <ul className={`dropdown-menu dropdown-menu-custom ${activeDropdown === 'gioi-thieu' ? 'show' : ''}`}>
                                        <li><Link className="dropdown-item" to="/ban-giam-doc" onClick={closeMenu}>Ban Giám đốc</Link></li>
                                        <li><Link className="dropdown-item" to="/cac-phong-khoa" onClick={closeMenu}>Các phòng khoa</Link></li>
                                        <li><Link className="dropdown-item" to="/to-chuc" onClick={closeMenu}>Tổ chức đoàn thể</Link></li>
                                        <li><hr className="dropdown-divider" /></li>
                                        <li><Link className="dropdown-item" to="/tong-quan" onClick={closeMenu}>Tổng quan</Link></li>
                                    </ul>
                                </li>

                                {/* --- MENU ĐỘNG TỪ DATABASE --- */}
                                {menuTree.map(parent => (
                                    <li key={parent.categoryId} className="nav-item dropdown"
                                        onMouseEnter={() => handleMouseEnter(`cat-${parent.categoryId}`)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <Link className={`nav-link dropdown-toggle ${isActive(`/danh-muc/${parent.slug}`)}`}
                                            to={`/danh-muc/${parent.slug}`}
                                            onClick={(e) => {
                                                closeMenu();
                                            }}
                                        >
                                            {parent.categoryName}
                                        </Link>
                                        {/* Dropdown con (nếu có) */}
                                        {parent.children && parent.children.length > 0 && (
                                            <ul className={`dropdown-menu dropdown-menu-custom ${activeDropdown === `cat-${parent.categoryId}` ? 'show' : ''}`}>
                                                {/* Đã bỏ "Xem tất cả" theo yêu cầu */}

                                                {/* Các mục con */}
                                                {parent.children.map(child => (
                                                    <li key={child.categoryId}>
                                                        <Link className="dropdown-item" to={`/danh-muc/${child.slug}`} onClick={closeMenu}>
                                                            {child.categoryName}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}

                                <li className="nav-item"><Link className={`nav-link ${isActive('/lien-he')}`} to="/lien-he" onClick={closeMenu}>Liên hệ</Link></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            {/* --- BODY --- */}
            {/* Tăng paddingTop vì Navbar giờ cao hơn (khoảng 100px) để không che nội dung */}
            <main className="flex-grow-1" style={{ paddingTop: scrolled ? '85px' : '105px', transition: 'padding 0.3s ease' }}>
                {children}
            </main>

            {/* --- FOOTER --- */}
            <footer>
                <div className="footer-links-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-2 col-md-4 col-6 mb-4">
                                <h5 className="footer-col-title">Giới thiệu</h5>
                                <ul className="footer-links-list">
                                    <li><Link to="/ban-giam-doc">Ban Giám đốc</Link></li>
                                    <li><Link to="/cac-phong-khoa">Các phòng khoa</Link></li>
                                    <li><Link to="/to-chuc">Tổ chức đoàn thể</Link></li>
                                    <li><Link to="/tong-quan">Tổng quan</Link></li>
                                </ul>
                            </div>
                            <div className="col-lg-2 col-md-4 col-6 mb-4">
                                <h5 className="footer-col-title">Tin tức</h5>
                                <ul className="footer-links-list">
                                    <li><Link to="/tin-tuc">Tin tức chung</Link></li>
                                    <li><Link to="/dau-thau">Thông tin đấu thầu</Link></li>
                                </ul>
                            </div>
                            <div className="col-lg-2 col-md-4 col-6 mb-4">
                                <h5 className="footer-col-title">Đào tạo</h5>
                                <ul className="footer-links-list">
                                    <li><Link to="/dao-tao/chuong-trinh">Chương trình môn học</Link></li>
                                    <li><Link to="/dao-tao/tai-lieu">Tài liệu tham khảo</Link></li>
                                    <li><Link to="/dao-tao/thong-bao">Thông báo & Lịch học</Link></li>
                                    <li><Link to="/dao-tao/quy-che">Quy chế, quy định</Link></li>
                                </ul>
                            </div>
                            <div className="col-lg-2 col-md-4 col-6 mb-4">
                                <h5 className="footer-col-title">Quản lý SV</h5>
                                <ul className="footer-links-list">
                                    <li><Link to="/quan-ly-sv/ke-hoach">Kế hoạch tiếp nhận</Link></li>
                                    <li><Link to="/quan-ly-sv/cam-nang">Cẩm nang sinh viên</Link></li>
                                    <li><Link to="/quan-ly-sv/hoat-dong">Hoạt động ngoại khóa</Link></li>
                                    <li><Link to="/quan-ly-sv/le-khai-giang">Lễ khai giảng/bế giảng</Link></li>
                                </ul>
                            </div>
                            <div className="col-lg-2 col-md-4 col-6 mb-4">
                                <h5 className="footer-col-title">Công khai</h5>
                                <ul className="footer-links-list">
                                    <li><Link to="/cong-khai/chung">Thông tin chung</Link></li>
                                    <li><Link to="/cong-khai/chuong-trinh">Chương trình GDQP</Link></li>
                                    <li><Link to="/cong-khai/co-so-vat-chat">Cơ sở vật chất</Link></li>
                                </ul>
                            </div>
                            <div className="col-lg-2 col-md-4 col-6 mb-4">
                                <h5 className="footer-col-title">Không gian VH HCM</h5>
                                <ul className="footer-links-list">
                                    <li><Link to="/khong-gian-vh/tu-lieu">Tư liệu học tập Bác Hồ</Link></li>
                                    <li><Link to="/khong-gian-vh/hinh-anh">Hình ảnh và video</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-info-section">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-8">
                                <div className="d-flex align-items-start mb-3">
                                    <img src="/img/logottgdqp.png" alt="Logo Footer" style={{ height: '70px', marginRight: '15px', objectFit: 'contain' }} />
                                </div>
                                <div className="footer-contact-info ms-lg-2">
                                    <div className="footer-contact-item">
                                        <i className="fa-solid fa-location-dot"></i>
                                        <span>Số 1, Lê Quý Đôn, Khu đô thị ĐHQG HCM, P. Đông Hòa, TP. Dĩ An, Bình Dương</span>
                                    </div>
                                    <div className="footer-contact-item">
                                        <i className="fa-solid fa-phone"></i>
                                        <span>Phòng Tổ chức - Hành chính: 028 6272 8214 - Email: <a href="mailto:info@ttgdqp.edu.vn">info@ttgdqp.edu.vn</a></span>
                                    </div>
                                    <div className="footer-contact-item social-links mt-3">
                                        <a href="#"><i className="fa-brands fa-facebook"></i> Fanpage TTGDQP&AN</a>
                                        <a href="#" className="text-danger"><i className="fa-brands fa-youtube"></i> Kênh Youtube TTGDQP&AN</a>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4">
                                <div className="visitor-stats">
                                    <div className="stat-row">
                                        ĐANG ONLINE: <span className="online-number">16</span>
                                    </div>
                                    <div className="stat-row">
                                        LƯỢT TRUY CẬP: <span className="total-number">3.917.407</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-copyright text-center py-3">
                    <div className="container">
                        © 2025 Bản quyền thuộc về <strong>Trung tâm Giáo dục Quốc phòng và An ninh</strong>.
                    </div>
                </div>
            </footer>

            <button className={`back-to-top-btn ${showBackToTop ? 'visible' : ''}`} onClick={scrollToTop}>
                <i className="fa-solid fa-chevron-up"></i>
            </button>
        </div>
    );
};

export default MainLayout;