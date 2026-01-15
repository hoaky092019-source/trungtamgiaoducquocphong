// src/pages/TongQuanPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import CategoryLayout from "../layouts/CategoryLayout";

const TongQuanPage = () => {
  // 1. Cấu hình Menu Tab cho trang này
  const tabsList = [
    { label: "Ban Giám đốc", path: "/ban-giam-doc" },
    { label: "Các phòng khoa", path: "/cac-phong-khoa" },
    { label: "Tổ chức đoàn thể", path: "/to-chuc" },
    { label: "Tổng quan", path: "/tong-quan" }, // Active Tab
    { label: "Logo", path: "/logo" },
    { label: "Hình ảnh Slideshow", path: "/slideshow" },
  ];

  // 2. Dữ liệu bài viết giả lập (Giống ảnh mẫu)
  const articles = [
    {
      id: 1,
      title: "Lịch sử hình thành",
      date: "(23/11/2020)",
      summary:
        "Dựng nước gắn liền với giữ nước - là quy luật tồn tại và phát triển của dân tộc ta, quy luật đó hiện nay được thể hiện trong hai nhiệm vụ chiến lược là xây dựng và bảo vệ Tổ quốc Việt Nam XHCN...",
      img: "/img/slider1.jpg",
    },
    {
      id: 2,
      title: "Tầm nhìn, sứ mạng",
      date: "(23/11/2020)",
      summary:
        "Tầm nhìn: Là Trung tâm dẫn đầu trong hệ thống các Trung tâm Giáo dục Quốc phòng và An ninh trong cả nước. Sứ mệnh: Giáo dục cho sinh viên về kiến thức quốc phòng và an ninh để phát huy tinh thần yêu nước...",
      img: "/img/slider2.jpg",
    },
    {
      id: 3,
      title: "Cơ cấu tổ chức",
      date: "(23/11/2020)",
      summary:
        "Trung tâm Giáo dục Quốc phòng và An ninh tổ chức và hoạt động theo Quyết định số 411/QĐ-ĐHQG ngày 22/5/2017 của Giám đốc ĐHQG-HCM về ban hành Quy chế tổ chức và hoạt động...",
      img: "/img/slider3.jpg",
    },
    {
      id: 4,
      title: "Trung tâm Giáo dục Quốc phòng và An ninh qua những con số",
      date: "(23/11/2020)",
      summary:
        "Trải qua 28 năm hình thành và phát triển, Trung tâm đã đào tạo cho hơn 500.000 sinh viên các trường Đại học, Cao đẳng trên địa bàn TP.HCM và các tỉnh lân cận...",
      img: "/img/slider4.jpg",
    },
  ];

  return (
    <CategoryLayout
      title="Tổng quan"
      subtitle="Đôi nét về Trung tâm Giáo dục Quốc phòng và An ninh ĐHQG-HCM"
      tabs={tabsList}
      activeTab="Tổng quan" // Để nó tô màu xanh tab này
    >
      {/* Loop in ra danh sách bài viết */}
      {articles.map((item) => (
        <Link
          key={item.id}
          to={`/bai-viet/${item.id}`}
          className="list-item-card"
        >
          {/* CỘT ẢNH (Có chứa Date Badge) */}
          <div className="list-item-thumb">
            <img
              src={item.img}
              alt={item.title}
              onError={(e) => {
                e.target.src = "https://placehold.co/300x200";
              }}
            />
            {/* Nhãn ngày tháng đặt nổi trên ảnh */}
            <div className="date-badge">
              <i className="fa-regular fa-calendar-days"></i>
              {/* Cắt bỏ dấu ngoặc đơn nếu có trong data gốc: (23/11/2020) -> 23/11/2020 */}
              {item.date.replace(/[()]/g, "")}
            </div>
          </div>

          {/* CỘT NỘI DUNG */}
          <div className="list-item-content">
            <h3 className="list-item-title">{item.title}</h3>

            {/* Không cần hiển thị date ở đây nữa vì đã đưa lên ảnh */}

            <p className="list-item-summary">{item.summary}</p>

            {/* Nút Xem chi tiết giả */}
            <span className="read-more-link">
              Xem chi tiết <i className="fa-solid fa-arrow-right"></i>
            </span>
          </div>
        </Link>
      ))}
    </CategoryLayout>
  );
};

export default TongQuanPage;
