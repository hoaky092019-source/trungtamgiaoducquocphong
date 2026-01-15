import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import postService from '../services/postService';
import MainLayout from '../layouts/MainLayout';
import '../css/site.css'; // Đảm bảo styles cho bài viết

const PostDetailPage = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        postService.getBySlug(slug)
            .then(data => {
                setPost(data);
                setError(null);
            })
            .catch(err => {
                console.error("Lỗi load bài viết:", err);
                setError("Không tìm thấy bài viết hoặc bài viết đã bị xóa.");
            })
            .finally(() => setLoading(false));
    }, [slug]);

    if (loading) {
        return (
            <MainLayout>
                <div className="container py-5 text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (error || !post) {
        return (
            <MainLayout>
                <div className="container py-5 text-center">
                    <h3 className="text-danger mb-3">Thông báo</h3>
                    <p className="lead">{error || "Bài viết không tồn tại"}</p>
                    <Link to="/" className="btn btn-secondary">Quay về trang chủ</Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout>
            <div className="container py-5">
                {/* Breakcrumb đơn giản */}
                <nav aria-label="breadcrumb" className="mb-4">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><Link to="/">Trang chủ</Link></li>
                        <li className="breadcrumb-item">
                            <Link to={`/danh-muc/${post.slug?.split('-')[0] || 'tin-tuc'}`}>
                                {post.categoryName || "Tin tức"}
                            </Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">{post.title}</li>
                    </ol>
                </nav>

                <div className="row justify-content-center">
                    <div className="col-lg-10">
                        {/* Tiêu đề */}
                        <h1 className="fw-bold mb-3 text-primary-custom">{post.title}</h1>

                        {/* Meta info */}
                        <div className="d-flex align-items-center text-muted mb-4 small">
                            <div className="me-3">
                                <i className="fa-regular fa-calendar me-1"></i>
                                {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                            </div>
                            <div className="me-3">
                                <i className="fa-regular fa-user me-1"></i>
                                {post.authorName || "Ban biên tập"}
                            </div>
                            <div>
                                <i className="fa-regular fa-eye me-1"></i>
                                {post.viewCount} lượt xem
                            </div>
                        </div>

                        {/* Nội dung bài viết (Renderer HTML) */}
                        <article className="post-content ck-content">
                            {/* Dùng dangerouslySetInnerHTML để render HTML từ CKEditor */}
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </article>

                        <hr className="my-5" />

                        {/* Nút điều hướng */}
                        <div className="d-flex justify-content-between">
                            <Link to="/" className="btn btn-outline-secondary">
                                <i className="fa-solid fa-arrow-left me-2"></i> Trang chủ
                            </Link>
                            {/* Chỗ này có thể thêm nút "Bài tiếp theo" nếu muốn logic phức tạp hơn */}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default PostDetailPage;
