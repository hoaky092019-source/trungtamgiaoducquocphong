import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import CategoryLayout from '../layouts/CategoryLayout';
import categoryService from '../services/categoryService';
import postService from '../services/postService';
import StudentLoginWidget from '../components/widgets/StudentLoginWidget';

const CategoryPostPage = ({ slugOverride }) => {
    const { slug: paramSlug } = useParams();
    const slug = slugOverride || paramSlug;
    const navigate = useNavigate();

    // Data State
    const [category, setCategory] = useState(null);
    const [posts, setPosts] = useState([]);
    const [tabsList, setTabsList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Pagination State
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 5;

    // Special slug for Student Portal
    const STUDENT_PORTAL_SLUG = 'cong-ttdt-sinh-vien';
    const isStudentPortal = slug === STUDENT_PORTAL_SLUG;

    useEffect(() => {
        // Reset page to 1 when slug changes
        setPage(1);
    }, [slug]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Get Category Info
                const allCats = await categoryService.getAll();
                const currentCat = allCats.find(c => c.slug === slug);

                if (!currentCat) {
                    setCategory(null);
                    setLoading(false);
                    return;
                }
                setCategory(currentCat);

                // 2. Build Sidebar Tabs
                let relatedCats = [];
                let parentCat = null;
                if (!currentCat.parentCategoryId) {
                    // Is Parent
                    parentCat = currentCat;
                    relatedCats = allCats.filter(c => c.parentCategoryId === currentCat.categoryId);
                } else {
                    // Is Child
                    parentCat = allCats.find(c => c.categoryId === currentCat.parentCategoryId);
                    relatedCats = allCats.filter(c => c.parentCategoryId === parentCat?.categoryId);
                }

                const tabs = relatedCats.map(c => ({
                    label: c.categoryName,
                    path: `/danh-muc/${c.slug}`
                }));
                setTabsList(tabs);

                // 3. Fetch Posts with Pagination
                const response = await postService.getByCategorySlug(slug, page, LIMIT);

                if (response.data && Array.isArray(response.data)) {
                    setPosts(response.data);
                    setTotalPages(response.totalPages || 1);
                } else if (Array.isArray(response)) {
                    setPosts(response);
                    setTotalPages(1);
                }

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, page]);

    // Handle Page Change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            window.scrollTo(0, 0);
        }
    };

    if (loading) {
        return (
            <CategoryLayout title="Đang tải..." subtitle="...">
                <div className="text-center py-5"><div className="spinner-border text-primary"></div></div>
            </CategoryLayout>
        );
    }

    if (!category) {
        return (
            <CategoryLayout title="Lỗi" subtitle="Không tìm thấy danh mục">
                <div className="text-center py-5">
                    <h3>Danh mục không tồn tại</h3>
                    <Link to="/" className="btn btn-secondary mt-3">Về trang chủ</Link>
                </div>
            </CategoryLayout>
        );
    }

    return (
        <CategoryLayout
            title={category.categoryName}
            subtitle={category.description || `Tin tức - ${category.categoryName}`}
            tabs={tabsList}
            activeTab={category.categoryName}
            sidebarContent={isStudentPortal ? <StudentLoginWidget /> : null}
        >
            <div className="d-flex flex-column gap-4">
                {posts.length === 0 ? (
                    <div className="alert alert-info text-center">
                        Hiện chưa có bài viết nào trong mục này.
                    </div>
                ) : (
                    posts.map((item) => (
                        <div key={item.postId} className="list-item-card d-flex gap-3 border bg-white rounded-3 overflow-hidden shadow-sm p-3">
                            {/* Left: Thumbnail */}
                            <div className="list-item-thumb position-relative" style={{ width: '280px', flexShrink: 0 }}>
                                <Link to={`/bai-viet/${item.slug}`}>
                                    <img
                                        src={item.thumbnail}
                                        alt={item.title}
                                        className="w-100 h-100 object-fit-cover rounded"
                                        style={{ aspectRatio: '4/3' }}
                                        onError={(e) => { e.target.src = "https://placehold.co/300x200"; }}
                                    />
                                </Link>
                            </div>

                            {/* Right: Content */}
                            <div className="list-item-content d-flex flex-column justify-content-between flex-grow-1">
                                <div>
                                    <Link to={`/bai-viet/${item.slug}`} className="text-decoration-none">
                                        <h3 className="fw-bold text-dark fs-5 mb-2 list-item-title-hover">{item.title}</h3>
                                    </Link>

                                    {/* Author & Meta Row */}
                                    <div className="d-flex align-items-center gap-3 text-secondary mb-2" style={{ fontSize: '0.85rem' }}>
                                        <span>
                                            <i className="fa-solid fa-user me-1"></i>
                                            {item.authorName || 'Ban biên tập'}
                                        </span>
                                        <span>
                                            <i className="fa-regular fa-calendar-days me-1"></i>
                                            {new Date(item.createdAt).toLocaleDateString('vi-VN')}
                                        </span>
                                        <span>
                                            <i className="fa-regular fa-eye me-1"></i>
                                            {item.viewCount || 0}
                                        </span>
                                    </div>

                                    <p className="text-secondary mb-2" style={{
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {item.summary || "..."}
                                    </p>
                                </div>

                                <div>
                                    <Link to={`/bai-viet/${item.slug}`} className="text-primary text-decoration-none fw-medium request-hover-effect">
                                        Xem chi tiết <i className="fa-solid fa-arrow-right ms-1"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}

                {/* Pagination Controls */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center mt-4">
                        <nav>
                            <ul className="pagination">
                                <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(page - 1)}>
                                        <i className="fa-solid fa-chevron-left"></i>
                                    </button>
                                </li>
                                {[...Array(totalPages)].map((_, idx) => (
                                    <li key={idx + 1} className={`page-item ${page === idx + 1 ? 'active' : ''}`}>
                                        <button className="page-link" onClick={() => handlePageChange(idx + 1)}>
                                            {idx + 1}
                                        </button>
                                    </li>
                                ))}
                                <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(page + 1)}>
                                        <i className="fa-solid fa-chevron-right"></i>
                                    </button>
                                </li>
                            </ul>
                        </nav>
                    </div>
                )}
            </div>
        </CategoryLayout>
    );
};

export default CategoryPostPage;
