// src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
// QUAN TRỌNG: Import file CSS riêng của trang chủ
import "../css/HomePage.css";

const HomePage = () => {
  // Dữ liệu mẫu giả lập (Giống hệt ảnh bạn gửi)
  const mockNews = [
    {
      id: 1,
      title:
        "TRUNG TÂM GIÁO DỤC QUỐC PHÒNG VÀ AN NINH, ĐHQG-HCM TỔ CHỨC HỌP MẶT KỶ NIỆM 28 NĂM NGÀY TRUYỀN THỐNG (25/12/1997 - 25/12/2025)",
      date: "(26/12/2025)",
      summary:
        "Chiều ngày 25/12/2025, tại Hội trường lớn, Trung tâm đã long trọng tổ chức...",
      image: "/img/sinhvien1.jpg", // Tạm dùng ảnh slider, bạn thay ảnh thật sau
      isNew: true,
    },
    {
      id: 2,
      title:
        "TRUNG TÂM GIÁO DỤC QUỐC PHÒNG VÀ AN NINH TỔ CHỨC THÀNH CÔNG HỘI NGHỊ CÁN BỘ, VIÊN CHỨC, NGƯỜI LAO ĐỘNG NĂM 2025",
      date: "(26/12/2025)",
      summary:
        "Sáng ngày 25/12/2025, Hội nghị đại biểu Cán bộ viên chức đã diễn ra thành công tốt đẹp...",
      image: "/img/sinhvien2.jpg",
      isNew: true,
    },
    {
      id: 3,
      title:
        "TỔ CHỨC THÀNH CÔNG HỘI NGHỊ TỔNG KẾT CÔNG TÁC ĐẢNG VÀ BIỂU DƯƠNG ĐIỂN HÌNH 'DÂN VẬN KHÉO' NĂM 2025",
      date: "(22/12/2025)",
      summary:
        "Sáng ngày 22/12, tại phòng họp Trường Sơn, Đảng ủy Trung tâm đã tổ chức...",
      image: "/img/sinhvien3.jpg",
      isNew: false,
    },
    {
      id: 4,
      title:
        "VÙNG 2 HẢI QUÂN KÝ KẾT CHƯƠNG TRÌNH PHỐI HỢP TUYÊN TRUYỀN BIỂN ĐẢO VÀ THU HÚT NGUỒN NHÂN LỰC",
      date: "(14/12/2025)",
      summary:
        "Chiều 9/12, tại xã Long Sơn (TP. Hồ Chí Minh), Bộ Tư lệnh Vùng 2 Hải quân...",
      image: "/img/sinhvien4.jpg",
      isNew: false,
    },
    {
      id: 5,
      title:
        "THIẾU TƯỚNG TRẦN ĐỨC THẮNG THÔNG TIN THỜI SỰ VÀ GẶP GỠ, NẮM TÌNH HÌNH TƯ TƯỞNG SĨ QUAN BIỆT PHÁI",
      date: "(03/12/2025)",
      summary:
        "Chiều 27 tháng 11, tại Trung tâm Giáo dục Quốc phòng và An ninh...",
      image: "/img/sinhvien5.jpg",
      isNew: false,
    },
    {
      id: 6,
      title:
        "ĐẢNG ỦY TRUNG TÂM GIÁO DỤC QUỐC PHÒNG VÀ AN NINH TRAO QUYẾT ĐỊNH CÔNG TÁC NHÂN SỰ ĐỐI VỚI SĨ QUAN BIỆT PHÁI",
      date: "(03/12/2025)",
      summary:
        "Sáng 02/12/2025, tại phòng họp Ban Giám đốc đã diễn ra lễ trao quyết định...",
      image: "/img/sinhvien6.jpg",
      isNew: false,
    },
  ];
  const mockActivities = [
    { id: 1, img: "/img/sinhvien1.jpg", title: "Lễ khai giảng" },
    { id: 2, img: "/img/sinhvien2.jpg", title: "Duyệt binh" },
    { id: 3, img: "/img/sinhvien4.jpg", title: "Văn nghệ" },
  ];
  const mockNotices = [
    {
      id: 1,
      day: "19",
      month: "01",
      year: "2026",
      title:
        "Thông báo đăng ký học lại môn học GDQPAN đợt học từ ngày 19/01/2026 đến 12/02/2026 (Chương trình đại học)",
      publishDate: "08/12/2025",
      summary:
        "Nhằm tạo điều kiện cho sinh viên hoàn thành môn học Giáo dục quốc phòng và an ninh, Trung tâm thông báo...",
    },
    {
      id: 2,
      day: "01",
      month: "01",
      year: "2026",
      title:
        "Thông báo đăng ký học lại môn học GDQPAN đợt tháng 01/2026 (Chương trình đại học)",
      publishDate: "05/11/2025",
      summary:
        "Nhằm tạo điều kiện cho sinh viên hoàn thành môn học Giáo dục quốc phòng và an ninh, Trung tâm thông báo...",
    },
    {
      id: 3,
      day: "12",
      month: "12",
      year: "2025",
      title:
        "Thông báo lịch thi kết thúc học phần tháng 12/2025 cho sinh viên khóa 452",
      publishDate: "07/10/2025",
      summary:
        "Lịch thi chi tiết sẽ được cập nhật trên cổng thông tin sinh viên. Đề nghị các em theo dõi thường xuyên...",
    },
    {
      id: 4,
      day: "11",
      month: "11",
      year: "2025",
      title:
        "Kế hoạch tổ chức Hội thao Quốc phòng sinh viên mở rộng lần thứ V năm 2025",
      publishDate: "08/09/2025",
      summary:
        "Trung tâm ban hành kế hoạch tổ chức Hội thao nhằm rèn luyện sức khỏe và kỹ năng quân sự cho sinh viên...",
    },
  ];
  const mockGallery = [
    {
      id: 1,
      img: "/img/sinhvien1.jpg",
      title: "Check-in Cột mốc QPAN",
      desc: "Nơi lưu giữ kỷ niệm đẹp của sinh viên.",
    },
    {
      id: 2,
      img: "/img/sinhvien6.jpg",
      title: "Tình yêu Quân sự",
      desc: "Biểu tượng trái tim QPAN đầy tự hào.",
    },
    {
      id: 3,
      img: "/img/sinhvien4.jpg",
      title: "Duyệt đội ngũ",
      desc: "Rèn luyện tác phong, kỷ luật nghiêm minh.",
    },
    {
      id: 4,
      img: "/img/sinhvien5.jpg",
      title: "Hành quân rèn luyện",
      desc: "Vượt nắng thắng mưa, say sưa tập luyện.",
    },
  ];
  return (
    <MainLayout>
      {/* --- SLIDER --- */}
      <div
        id="homeCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        data-bs-interval="4000"
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide-to="0"
            className="active"
          ></button>
          <button
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide-to="1"
          ></button>
          <button
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide-to="2"
          ></button>
          <button
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide-to="3"
          ></button>
        </div>

        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="/img/sinhvien4.jpg"
              className="d-block w-100"
              alt="Slide 1"
              style={{ height: "85vh", objectFit: "cover" }}
            />
            <div
              className="carousel-caption d-none d-md-block text-start"
              style={{ bottom: "20%", left: "10%" }}
            >
              <h1
                className="display-3 fw-bold text-white animate-fade-up"
                style={{ textShadow: "2px 2px 10px #000" }}
              >
                28 NĂM <span style={{ color: "var(--gold)" }}>HÌNH THÀNH</span>
              </h1>
              <div className="slogan-box mt-3 animate-fade-up delay-1">
                <p className="slogan-text">
                  ĐOÀN KẾT - KỶ CƯƠNG - CHẤT LƯỢNG - TIÊN PHONG
                </p>
              </div>
            </div>
          </div>
          {/* Các slide khác giữ nguyên... */}
          <div className="carousel-item">
            <img
              src="/img/sinhvien2.jpg"
              className="d-block w-100"
              alt="Slide 2"
              style={{ height: "85vh", objectFit: "cover" }}
            />
            <div
              className="carousel-caption d-none d-md-block text-start"
              style={{ bottom: "20%", left: "10%" }}
            >
              <h1 className="display-3 fw-bold text-white animate-fade-up">
                RÈN LUYỆN <span style={{ color: "var(--gold)" }}>THÉP</span>
              </h1>
              <div className="slogan-box mt-3 animate-fade-up delay-1">
                <p className="slogan-text">
                  TÂM TRONG - TRÍ SÁNG - HOÀI BÃO LỚN
                </p>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="/img/sinhvien3.jpg"
              className="d-block w-100"
              alt="Slide 3"
              style={{ height: "85vh", objectFit: "cover" }}
            />
            <div
              className="carousel-caption d-none d-md-block text-start"
              style={{ bottom: "20%", left: "10%" }}
            >
              <div className="slogan-box animate-fade-up">
                <p className="slogan-text">CHUẨN MỰC - CHÍNH QUY - HIỆN ĐẠI</p>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="/img/slider4.jpg"
              className="d-block w-100"
              alt="Slide 4"
              style={{ height: "85vh", objectFit: "cover" }}
            />
            <div
              className="carousel-caption d-none d-md-block text-start"
              style={{ bottom: "20%", left: "10%" }}
            >
              <div className="slogan-box animate-fade-up">
                <p className="slogan-text">
                  HỘI NHẬP - PHÁT TRIỂN - TINH THÔNG
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#homeCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#homeCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* --- PHẦN TIN TỨC SỰ KIỆN (GRID 2 CỘT) --- */}
      <div className="news-section container">
        <h3 className="news-title-heading">TIN TỨC</h3>

        <div className="row">
          {mockNews.map((item) => (
            <div key={item.id} className="col-lg-6 col-md-12 my-2">
              {/* Thẻ tin tức - Click vào sẽ chuyển trang (Link) */}
              <Link to={`/tin-tuc/${item.id}`} className="news-card">
                {/* Ảnh Thumb */}
                <div className="news-thumb">
                  <img src={item.image} alt={item.title} />
                </div>
                {/* Nội dung */}
                <div className="news-body">
                  <h5 className="news-heading">
                    {item.isNew && <span className="badge-new">NEW</span>}
                    {item.title}
                  </h5>
                  <div>
                    <p className="news-meta">
                      {item.date} {item.summary}
                    </p>
                    <span className="news-link">xem chi tiết</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
      {/* --- PHẦN HOẠT ĐỘNG TIÊU BIỂU (MỚI) --- */}
      <div className="activity-section">
        {/* Lớp phủ màu xanh */}
        <div className="activity-overlay"></div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            {/* Cột Trái: Ảnh nữ sinh viên */}
            <div className="col-lg-5 col-md-12 text-center mb-4 mb-lg-0">
              <div className="student-image-box">
                {/* Bạn nhớ kiếm ảnh nữ sinh tách nền (PNG) đặt tên là student.png nhé */}
                <img
                  src="/img/anhnen1.png"
                  alt="Sinh viên tiêu biểu"
                  className="student-img"
                />
              </div>
            </div>

            {/* Cột Phải: Nội dung & Gallery */}
            <div className="col-lg-7 col-md-12 text-white">
              <h3 className="activity-title fw-bold text-uppercase mb-3">
                LỄ KHAI GIẢNG KHÓA 452 GIÁO DỤC QUỐC PHÒNG AN NINH TẠI TRUNG TÂM
                GDQPAN, ĐHQG-HCM
              </h3>
              <p className="activity-desc mb-4">
                Sáng nay, ngày 30/7 Trung tâm Giáo dục quốc phòng và An ninh
                (GDQPAN), Đại học Quốc gia Thành phố Hồ Chí Minh (ĐHQG-HCM) đã
                long trọng tổ chức Lễ Khai giảng Khóa học 452 môn học Giáo dục
                Quốc phòng và An ninh cho 4.831 sinh viên.
              </p>

              {/* 3 Thẻ nhỏ bên dưới */}
              <div className="row g-3">
                {mockActivities.map((act) => (
                  <div key={act.id} className="col-4">
                    <div className="activity-card">
                      <div className="act-thumb">
                        <img
                          src={act.img}
                          alt={act.title}
                          onError={(e) => {
                            e.target.src = "https://placehold.co/200x150";
                          }}
                        />
                      </div>
                      {/* --- CẬP NHẬT NÚT BẤM TẠI ĐÂY --- */}
                      <button className="btn-view-more">
                        XEM THÊM{" "}
                        <i
                          className="fa-solid fa-chevron-right ms-2"
                          style={{ fontSize: "0.8rem" }}
                        ></i>
                      </button>
                      {/* -------------------------------- */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ------------------------------------------- */}
      {/* --- PHẦN THÔNG BÁO & LỊCH HỌC (MỚI) --- */}
      <div className="notice-section">
        <div className="container">
          {/* Tiêu đề mục */}
          <h3 className="news-title-heading">THÔNG BÁO & LỊCH HỌC</h3>

          <div className="row g-4">
            {mockNotices.map((item) => (
              <div key={item.id} className="col-lg-6 col-md-12">
                <Link to={`/thong-bao/${item.id}`} className="notice-card">
                  {/* Cột trái: Box Ngày tháng (CSS thuần) */}
                  <div className="notice-date-box">
                    <span className="notice-day">{item.day}</span>
                    <span className="notice-month">Tháng {item.month}</span>
                  </div>

                  {/* Cột phải: Nội dung */}
                  <div className="notice-body">
                    <h5 className="notice-title">{item.title}</h5>
                    <p className="notice-meta">
                      <i className="fa-regular fa-clock me-1"></i> Đăng ngày:{" "}
                      {item.publishDate}
                    </p>
                    <p className="notice-summary">{item.summary}</p>
                    <span className="notice-link">
                      Xem chi tiết{" "}
                      <i className="fa-solid fa-arrow-right ms-1"></i>
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* ------------------------------------------- */}
      {/* --- PHẦN LỜI BÁC DẠY (MỚI) --- */}
      <div className="quote-section">
        {/* Ảnh hoa sen nền chìm */}
        <div className="lotus-bg"></div>

        <div className="container position-relative" style={{ zIndex: 2 }}>
          <div className="row align-items-center">
            {/* Cột trái: Nội dung */}
            <div className="col-lg-8 col-md-12">
              <h4 className="quote-header text-uppercase fw-bold text-white mb-4">
                Lời Bác dạy ngày này năm xưa
              </h4>

              <div className="quote-box">
                {/* Dấu móc trang trí bằng CSS */}
                <div className="quote-content">
                  "Nâng cao trình độ văn hóa của nhân dân là một việc làm cần
                  thiết để xây dựng nước ta thành một nước hòa bình, thống nhất,
                  độc lập, dân chủ và giàu mạnh"{" "}
                  <span className="citation">[51]</span>.
                </div>
              </div>
            </div>

            {/* Cột phải: Hình Bác */}
            <div className="col-lg-4 col-md-12 text-end d-none d-lg-block">
              <div className="uncle-ho-box">
                <img
                  src="/img/bacho.jpg"
                  alt="Chủ tịch Hồ Chí Minh"
                  className="uncle-ho-img"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ------------------------------------------- */}
      {/* --- PHẦN HOẠT ĐỘNG NGOẠI KHÓA (MỚI) --- */}
      <div className="extra-section">
        <div className="container">
          {/* Tiêu đề */}
          <div className="text-center mb-5">
            <h3 className="section-title fw-bold text-uppercase">
              Hoạt động ngoại khóa
            </h3>
            <p className="section-subtitle">
              Nêu cao tinh thần tự giác học tập - rèn luyện tác phong Quân nhân
            </p>
            <div className="divider-icon">
              <i className="fa-solid fa-star"></i>
            </div>
          </div>

          {/* Grid 4 Ảnh - Hiệu ứng Hover xịn */}
          <div className="row g-4">
            {mockGallery.map((item) => (
              <div key={item.id} className="col-lg-3 col-md-6">
                <div className="gallery-card">
                  <img
                    src={item.img}
                    alt={item.title}
                    onError={(e) => {
                      e.target.src = "https://placehold.co/300x400";
                    }}
                  />
                  {/* Lớp phủ thông tin khi hover */}
                  <div className="gallery-overlay">
                    <h6 className="gallery-title">{item.title}</h6>
                    <p className="gallery-desc">{item.desc}</p>
                    <button className="btn-gallery-icon">
                      <i className="fa-solid fa-expand"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Phần mô tả / Trích dẫn bên dưới */}
          <div className="row justify-content-center mt-5">
            <div className="col-lg-10">
              <div className="extra-quote-box text-center">
                <i className="fa-solid fa-quote-left quote-icon-start"></i>
                <p className="mb-0">
                  Duy trì nghiêm kỷ luật quân đội, lễ tiết, tác phong quân nhân
                  là hoạt động thường xuyên, liên tục. Đó là truyền thống quý
                  báu:{" "}
                  <span className="highlight-text">
                    "Kỷ luật là sức mạnh của quân đội"
                  </span>
                  . Là sự giữ gìn và tỏa sáng phẩm chất{" "}
                  <strong>Bộ đội Cụ Hồ</strong>, góp phần tạo sự đoàn kết, thống
                  nhất, nâng cao sức mạnh chiến đấu.
                </p>
                <i className="fa-solid fa-quote-right quote-icon-end"></i>
              </div>
              <div className="text-center mt-3">
                <a href="#" className="see-more-link">
                  Xem tất cả hoạt động{" "}
                  <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ------------------------------------------- */}
      {/* --- PHẦN CHIA SẺ (TESTIMONIAL) - MỚI --- */}
      <div className="sharing-section">
        <div className="container position-relative z-2">
          <div className="row align-items-center">
            {/* CỘT TRÁI: THÔNG TIN NGƯỜI GỬI (35%) */}
            <div className="col-lg-4 text-center mb-4 mb-lg-0">
              <div className="avatar-wrapper">
                {/* Ảnh Avatar tròn */}
                <img
                  src="/img/anhmau1.jpg"
                  alt="Avatar"
                  className="sharing-avatar"
                  onError={(e) => {
                    e.target.src = "https://placehold.co/200x200";
                  }}
                />
                <div className="avatar-decor"></div>
              </div>
              <div className="author-info mt-3">
                <h5 className="author-name fw-bold text-white mb-1">
                  KHẢ HÂN - CPHTC22
                </h5>
                <p className="author-school text-white-50 small text-uppercase">
                  Đại học KHXH&NV, ĐHQG-HCM
                </p>
              </div>
            </div>

            {/* CỘT PHẢI: NỘI DUNG (65%) */}
            <div className="col-lg-8 ps-lg-5">
              {/* Tiêu đề & Chữ viết tay */}
              <div className="sharing-header mb-4">
                <h2 className="sharing-title text-uppercase">CHIA SẺ TỪ...</h2>
                <h3 className="sharing-subtitle">Người Đi Trước</h3>
              </div>

              {/* Nội dung thư */}
              <div className="sharing-content">
                <p
                  className="text-white mb-4"
                  style={{ lineHeight: "1.6", fontSize: "1.05rem" }}
                >
                  "Gửi Thầy Thượng tá Nguyễn Văn A cùng các thầy cô tại Trung
                  tâm,
                  <br />
                  <br />
                  Em là Khả Hân, sinh viên khóa 452. Những ngày tháng rèn luyện
                  tại đây không chỉ dạy em tính kỷ luật mà còn cho em những kỷ
                  niệm tuyệt đẹp về tình đồng chí. Em nhớ mãi những buổi hành
                  quân vượt nắng thắng mưa, nhớ những bát cơm ấm tình quân
                  dân..."
                </p>
              </div>

              {/* Gallery 3 ảnh nhỏ */}
              <div className="sharing-gallery row g-2">
                <div className="col-4">
                  <img
                    src="/img/sinhvien5.jpg"
                    className="img-fluid border-white-sm"
                    alt="Share 1"
                  />
                </div>
                <div className="col-4">
                  <img
                    src="/img/sinhvien2.jpg"
                    className="img-fluid border-white-sm"
                    alt="Share 2"
                  />
                </div>
                <div className="col-4">
                  <img
                    src="/img/sinhvien6.jpg"
                    className="img-fluid border-white-sm"
                    alt="Share 3"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lớp phủ trang trí (nếu cần thêm họa tiết chìm) */}
        <div className="sharing-overlay"></div>
      </div>
      {/* ------------------------------------------- */}
      {/* --- PHẦN BẢN ĐỒ VỊ TRÍ (MỚI) --- */}
            <div className="map-section">
                <div className="container-fluid px-0"> {/* Full width */}
                    <div className="text-center mb-4">
                         <h3 className="map-title fw-bold text-uppercase">
                            Vị trí Trung Tâm Giáo Dục Quốc Phòng (Trường Quân Sự)
                        </h3>
                         <div className="divider-icon"><i className="fa-solid fa-location-dot"></i></div>
                    </div>
                    
                    <div className="map-container">
                       <iframe 
                title="Bản đồ Trường Quân sự Quân đoàn 4"
                src="https://maps.google.com/maps?q=Trường+Quân+Sự+Quân+đoàn+4+Bình+Dương&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="450" 
                style={{border:0}} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade">
            </iframe>
                    </div>
                </div>
            </div>
            {/* ------------------------------------------- */}
    </MainLayout>
  );
};

export default HomePage;
