import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import categoryService from '../services/categoryService';
import authService from '../services/authService';
import '../css/site.css';
import '../css/Footer.css';

const MainLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();

    // --- STATE ---
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [user, setUser] = useState(null);
    const [student, setStudent] = useState(null); // State cho sinh viên
    const [menuTree, setMenuTree] = useState([]);

    // --- EFFECT ---
    useEffect(() => {
        // 1. Check Admin User
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);

        // 2. Check Student User
        const studentInfo = localStorage.getItem('studentInfo');
        if (studentInfo) {
            setStudent(JSON.parse(studentInfo));
        }

        // 3. Load Menu (Categories)
        categoryService.getAll().then(cats => {
            const parents = cats.filter(c => !c.parentCategoryId);
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

    // Logout Student
    const handleStudentLogout = () => {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentInfo');
        setStudent(null);
        navigate('/danh-muc/cong-ttdt-sinh-vien');
        closeMenu();
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            {/* --- HEADER --- */}
            <header className="fixed-top">
                <nav className={`navbar navbar-expand-lg navbar-light navbar-custom ${scrolled ? 'navbar-scrolled' : ''}`}>
                    <div className="container">

                        {/* 1. LOGO */}
                        <Link className="navbar-brand d-flex align-items-center" to="/" onClick={closeMenu}>
                            <img src="/img/logottgdqp.png" alt="TTGDQP&AN Logo" />
                        </Link>

                        {/* 2. RIGHT AREA (Login/User) */}
                        <div className="d-flex align-items-center ms-auto order-lg-last">
                            <div className="me-2 me-lg-0 ms-3">
                                {student ? (
                                    /* STUDENT LOGGED IN */
                                    <div className="dropdown">
                                        <button className="btn btn-primary btn-sm fw-bold rounded-pill px-3 shadow-sm dropdown-toggle" type="button" id="studentDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                            <i className="fa-solid fa-user-graduate me-lg-2"></i>
                                            <span className="d-none d-sm-inline">{student.fullName}</span>
                                        </button>
                                        <ul className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2" aria-labelledby="studentDropdown">
                                            <li><Link className="dropdown-item py-2" to="/cong-thong-tin-sinh-vien/dashboard" onClick={closeMenu}><i className="fa-solid fa-table-columns me-2 text-primary"></i> Dashboard</Link></li>
                                            <li><Link className="dropdown-item py-2" to="/cong-thong-tin-sinh-vien/schedule" onClick={closeMenu}><i className="fa-regular fa-calendar me-2 text-success"></i> Lịch học tập</Link></li>
                                            <li><Link className="dropdown-item py-2" to="/cong-thong-tin-sinh-vien/grades" onClick={closeMenu}><i className="fa-solid fa-graduation-cap me-2 text-warning"></i> Kết quả học tập</Link></li>
                                            <li><Link className="dropdown-item py-2" to="/cong-thong-tin-sinh-vien/info" onClick={closeMenu}><i className="fa-solid fa-id-card me-2 text-info"></i> Hồ sơ cá nhân</Link></li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><button className="dropdown-item py-2 text-danger fw-bold" onClick={handleStudentLogout}><i className="fa-solid fa-right-from-bracket me-2"></i> Đăng xuất</button></li>
                                        </ul>
                                    </div>
                                ) : user ? (
                                    /* ADMIN LOGGED IN */
                                    <Link to="/admin/dashboard" className="btn btn-primary btn-sm fw-bold rounded-pill px-3 shadow-sm">
                                        <i className="fa-solid fa-user-shield me-lg-2"></i>
                                        <span className="d-none d-sm-inline">Quản trị</span>
                                    </Link>
                                ) : (
                                    /* GUEST */
                                    <Link to="/login" className="btn btn-outline-primary btn-sm fw-bold rounded-pill px-3">
                                        <i className="fa-solid fa-circle-user me-lg-2"></i>
                                        <span className="d-none d-sm-inline">Đăng nhập</span>
                                    </Link>
                                )}
                            </div>

                            {/* Hamburger */}
                            <button className="navbar-toggler ms-2" type="button" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} style={{ border: 'none', outline: 'none' }}>
                                <span className="navbar-toggler-icon"></span>
                            </button>
                        </div>

                        {/* 3. MENU */}
                        <div className={`collapse navbar-collapse order-lg-1 ${isMobileMenuOpen ? 'show' : ''}`} id="mainNav">
                            <ul className="navbar-nav mx-auto align-items-lg-center">
                                <li className="nav-item">
                                    <Link className={`nav-link ${isActive('/')}`} to="/" onClick={closeMenu}>
                                        <i className="fa-solid fa-house me-1"></i> Trang chủ
                                    </Link>
                                </li>

                                {/* --- PUBLIC MENU --- */}
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

                                {menuTree.map(parent => {
                                    // Check if this is the Student Portal Category
                                    const isStudentPortalCat = parent.slug === 'cong-ttdt-sinh-vien' || parent.slug === 'sinh-vien';

                                    // If Student Logged In AND this is Student Portal Cat -> SHOW SPECIAL MENU
                                    if (student && isStudentPortalCat) {
                                        return (
                                            <li key={parent.categoryId} className="nav-item dropdown"
                                                onMouseEnter={() => handleMouseEnter(`cat-${parent.categoryId}`)}
                                                onMouseLeave={handleMouseLeave}
                                            >
                                                <Link className={`nav-link dropdown-toggle active fw-bold text-primary`}
                                                    to={`/danh-muc/${parent.slug}`}
                                                    onClick={(e) => { toggleDropdown(e, `cat-${parent.categoryId}`); }}
                                                >
                                                    {parent.categoryName} <span className="badge bg-danger rounded-pill ms-1" style={{ fontSize: '0.6rem' }}>SV</span>
                                                </Link>
                                                <ul className={`dropdown-menu dropdown-menu-custom ${activeDropdown === `cat-${parent.categoryId}` ? 'show' : ''}`}>
                                                    <li><Link className="dropdown-item fw-bold text-primary" to="/cong-thong-tin-sinh-vien/dashboard" onClick={closeMenu}><i className="fa-solid fa-table-columns me-2"></i> Dashboard</Link></li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li><Link className="dropdown-item" to="/cong-thong-tin-sinh-vien/schedule" onClick={closeMenu}><i className="fa-regular fa-calendar me-2"></i> Lịch học tập</Link></li>
                                                    <li><Link className="dropdown-item" to="/cong-thong-tin-sinh-vien/grades" onClick={closeMenu}><i className="fa-solid fa-graduation-cap me-2"></i> Kết quả học tập</Link></li>
                                                    <li><Link className="dropdown-item" to="/cong-thong-tin-sinh-vien/info" onClick={closeMenu}><i className="fa-regular fa-id-card me-2"></i> Thông tin cá nhân</Link></li>
                                                    <li><hr className="dropdown-divider" /></li>
                                                    <li><button className="dropdown-item text-danger" onClick={handleStudentLogout}><i className="fa-solid fa-right-from-bracket me-2"></i> Đăng xuất</button></li>
                                                </ul>
                                            </li>
                                        );
                                    }

                                    // Default Rendering
                                    return (
                                        <li key={parent.categoryId} className="nav-item dropdown"
                                            onMouseEnter={() => handleMouseEnter(`cat-${parent.categoryId}`)}
                                            onMouseLeave={handleMouseLeave}
                                        >
                                            <Link className={`nav-link dropdown-toggle ${isActive(`/danh-muc/${parent.slug}`)}`}
                                                to={`/danh-muc/${parent.slug}`}
                                                onClick={(e) => { closeMenu(); }}
                                            >
                                                {parent.categoryName}
                                            </Link>
                                            {parent.children && parent.children.length > 0 && (
                                                <ul className={`dropdown-menu dropdown-menu-custom ${activeDropdown === `cat-${parent.categoryId}` ? 'show' : ''}`}>
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
                                    );
                                })}

                                <li className="nav-item"><Link className={`nav-link ${isActive('/lien-he')}`} to="/lien-he" onClick={closeMenu}>Liên hệ</Link></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </header>

            {/* --- BODY --- */}
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