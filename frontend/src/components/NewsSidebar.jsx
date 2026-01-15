// src/components/NewsSidebar.jsx
export default function NewsSidebar() {
  const news = [
    "✦ Đồng chí Tư lệnh Binh chủng dâng hương...",
    "✦ Lữ đoàn 139 phục vụ khách tham quan...",
    "✦ Đồng chí Phó Tổng Tham mưu trưởng...",
    "✦ Phóng sự ảnh - Ấn tượng trong buổi tổng duyệt..."
  ];

  return (
    <aside className="news-card col-md-2">
      <div className="card">
        <div className="card-header bg-light fw-bold">TIN MỚI</div>
        <ul className="list-group list-group-flush">
          {news.map((n,i) => <li key={i} className="list-group-item">{n}</li>)}
        </ul>
      </div>
    </aside>
  );
}
