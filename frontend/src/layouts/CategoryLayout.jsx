import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from './MainLayout';
import postService from '../services/postService';
import '../css/CategoryPage.css';

const CategoryLayout = ({ title, subtitle, tabs = [], activeTab, children, sidebarContent }) => {
    const [topPosts, setTopPosts] = useState([]);

    useEffect(() => {
        const fetchTopPosts = async () => {
            try {
                const res = await postService.getAll({ isPublic: true });
                // Sắp xếp theo lượt xem giảm dần, lấy 5 bài
                const sorted = [...res].sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0)).slice(0, 5);
                setTopPosts(sorted);
            } catch (error) {
                console.error("Failed to fetch top posts", error);
            }
        };
        fetchTopPosts();
    }, []);

    return (
        <MainLayout>
            <div className="page-banner">
                <div className="container">
                    <h1 className="page-title">{title}</h1>
                    <p className="page-subtitle">{subtitle}</p>
                </div>
            </div>

            <div className="container">
                {tabs.length > 0 && (
                    <div className="page-tabs-container">
                        {tabs.map((tab, index) => (
                            <Link
                                key={index}
                                to={tab.path}
                                className={`page-tab-item ${activeTab === tab.label ? 'active' : ''}`}
                            >
                                {tab.label}
                            </Link>
                        ))}
                    </div>
                )}

                <div className="row">
                    <div className="col-lg-8 mb-5">
                        {children}
                    </div>

                    <div className="col-lg-4 mb-5">
                        {/* Custom Widget Injection */}
                        {sidebarContent && (
                            <div className="mb-4">
                                {sidebarContent}
                            </div>
                        )}

                        <div className="sidebar-box">
                            <h4 className="sidebar-title">Đọc nhiều nhất</h4>

                            {topPosts.length > 0 && (
                                <>
                                    <div className="sidebar-featured">
                                        <img src={topPosts[0].thumbnail || "/img/slider1.jpg"} alt="Featured"
                                            onError={(e) => e.target.src = "https://placehold.co/300x200"} />
                                        <Link to={`/bai-viet/${topPosts[0].slug}`} className="sidebar-featured-title">
                                            {topPosts[0].title}
                                        </Link>
                                        <small className="text-muted">
                                            <i className="fa-regular fa-clock me-1"></i>
                                            {new Date(topPosts[0].createdAt).toLocaleDateString('vi-VN')}
                                        </small>
                                    </div>

                                    <ul className="sidebar-list">
                                        {topPosts.slice(1).map(post => (
                                            <li key={post.postId}>
                                                <Link to={`/bai-viet/${post.slug}`}>
                                                    <i className="fa-solid fa-angle-right"></i> {post.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}
                        </div>

                        <div className="sidebar-box">
                            <img src="/img/slider2.jpg" className="w-100 rounded" alt="Ad" />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default CategoryLayout;