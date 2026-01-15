// src/components/Sidebar.jsx
const items = [
  { icon: "/img/danguy.png", text: "Đảng ủy Binh chủng" },
  { icon: "/img/vanban.png", text: "Văn bản pháp quy" },
  { icon: "/img/chidao.png", text: "Chỉ đạo điều hành" },
  { icon: "/img/quanlyvanban.png", text: "Quản lý văn bản BQP" },
  { icon: "/img/luutru.png", text: "Lưu trữ trực tuyến" },
  { icon: "/img/chuyentrang3488.jpg", text: "Chuyên trang 3488" },
  { icon: "/img/binhdanhovu.jpg", text: "Bình dân học vụ số" },
  { icon: "/img/tracuu.png", text: "Tra cứu điện thoại QS" },
  { icon: "/img/thudientu.png", text: "Thư điện tử quân sự" },
  { icon: "/img/giaoduc.jpg", text: "Giáo dục chính trị" },
];

export default function Sidebar() {
  return (
    <aside className="left-sidebar col-md-2">
      <ul className="list-group">
        {items.map((it, idx) => (
          <li className="list-group-item" key={idx}>
            <img src={it.icon} alt={it.text} className="me-2" />
            {it.text}
          </li>
        ))}
      </ul>
    </aside>
  );
}
