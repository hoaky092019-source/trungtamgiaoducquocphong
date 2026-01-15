// src/pages/TinTucPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import CategoryLayout from '../layouts/CategoryLayout';

const TinTucPage = () => {
    // 1. Cấu hình Menu Tab riêng cho phần Tin Tức
    const tabsList = [
        { label: "Tin tức", path: "/tin-tuc" },
        { label: "Thông tin đấu thầu - mời chào giá", path: "/dau-thau" },
    ];

    // 2. Dữ liệu Tin tức (Giả lập từ ảnh mẫu)
    const newsList = [
        {
            id: 1,
            title: "Trung tâm GDQP&AN ĐHQG-HCM tổ chức họp mặt kỷ niệm 28 năm ngày truyền thống...",
            date: "(26/12/2025)",
            summary: "Chiều ngày 25/12/2025, tại Hội trường lớn, Trung tâm đã long trọng tổ chức Họp mặt kỷ niệm 28 năm ngày thành lập Trung tâm...",
            img: "/img/news1.jpg",
            isNew: true // Cờ đánh dấu tin mới
        },
        {
            id: 2,
            title: "Tổ chức thành công Hội nghị Tổng kết công tác Đảng và biểu dương điển hình 'Dân vận khéo' năm 2025",
            date: "(22/12/2025)",
            summary: "Sáng ngày 22/12, tại phòng họp Trường Sơn, Đảng ủy Trung tâm đã tổ chức Hội nghị tổng kết công tác Đảng năm 2025...",
            img: "/img/news2.jpg"
        },
        {
            id: 3,
            title: "Thiếu tướng Trần Đức Thắng thông tin thời sự và gặp gỡ, nắm tình hình tư tưởng sĩ quan biệt phái",
            date: "(03/12/2025)",
            summary: "Chiều 27 tháng 11, tại Trung tâm Giáo dục Quốc phòng và An ninh đã diễn ra buổi gặp mặt thân mật giữa Lãnh đạo...",
            img: "/img/news3.jpg"
        },
        {
            id: 4,
            title: "Vùng 2 Hải quân ký kết chương trình phối hợp tuyên truyền biển đảo và thu hút nguồn nhân lực",
            date: "(14/12/2025)",
            summary: "Chiều 9/12, tại xã Long Sơn (TP. Hồ Chí Minh), Bộ Tư lệnh Vùng 2 Hải quân đã tổ chức ký kết quy chế phối hợp...",
            img: "/img/news4.jpg"
        }
    ];

    return (
        <CategoryLayout 
            title="TIN TỨC" 
            subtitle="Cập nhật tin tức, sự kiện nổi bật tại Trung tâm"
            tabs={tabsList}
            activeTab="Tin tức" // Tab này sẽ sáng màu xanh
        >
            {/* Loop in danh sách tin tức */}
            {newsList.map((item) => (
                <Link key={item.id} to={`/tin-tuc/${item.id}`} className="list-item-card">
                    <div className="list-item-thumb position-relative">
                        <img src={item.img} alt={item.title} 
                             onError={(e) => {e.target.src = 'https://placehold.co/250x160'}}
                        />
                        {/* Nếu là tin mới thì hiện nhãn NEW màu vàng */}
                        {item.isNew && (
                            <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-2">NEW</span>
                        )}
                    </div>
                    <div className="list-item-content">
                        <h3 className="list-item-title">{item.title}</h3>
                        <p className="list-item-date"><i className="fa-regular fa-clock me-1"></i> {item.date}</p>
                        <p className="list-item-summary">{item.summary}</p>
                    </div>
                </Link>
            ))}

        </CategoryLayout>
    );
};

export default TinTucPage;