# Phase 2 Implementation Plan - Student Portal & Management
**Timeline:** Tháng 3-4/2026 (Updated for Immediate Start)
**Status:** 🟡 Starting
**Last Updated:** 2026-01-20

## 📋 Tổng Quan
**Mục Tiêu:**
Triển khai module "Cổng Thông Tin Điện Tử Sinh Viên" tích hợp vào danh mục bài viết hiện có.
**Chiến lược:** Trang "Cổng TTĐT Sinh viên" sẽ vừa là nơi hiển thị bài viết thông báo, vừa chứa Widget Login để sinh viên truy cập vào Dashboard cá nhân.

## Requirements
*   **Portal Entry:** Danh mục bài viết `/danh-muc/cong-thong-tin-sinh-vien`
*   **UI Integration:**
    *   Thêm Login Widget vào Sidebar hoặc Header của trang danh mục này.
    *   Form Login: MSSV + Trường + Khóa.
*   **Student Dashboard:** `/cong-thong-tin-sinh-vien/dashboard` (Chỉ truy cập được sau khi login từ widget).
*   **Admin Features:** Import sinh viên, quản lý School/Course.

## 💾 Database Schema
(Giữ nguyên Schema đã thiết kế: School, Course, Student, StudentGrade, Schedule)

## 🛠 Construction Steps

### Step 1: Backend Foundation (API)
- [x] EF Core Migrations: Create tables `Schools`, `Courses`, `Students`, `StudentGrades`, `Schedules`.
- [x] Auth API for Students: `POST /api/student/login`.
- [x] Data APIs: School/Course list for dropdowns.

### Step 2: Frontend UI - Student Login Widget
- [x] **Component:** `StudentLoginWidget.jsx`
- [x] **Vertical Form:** Chọn Trường -> Chọn Khóa -> Nhập MSSV -> Button 'Tra cứu'.
- [x] **Integration:**
    - [x] Sửa `CategoryPostPage.jsx`:
    - [x] Kiểm tra nếu `slug == 'cong-thong-tin-sinh-vien'`: Hiển thị thêm `StudentLoginWidget` ở vị trí Sidebar.

### Step 3: Student Dashboard
- [x] **Route:** `/cong-thong-tin-sinh-vien/dashboard` (Private Route cho Student).
- [x] **Layout:** `StudentLayout.jsx` (Mobile-first).
- [x] **Features:**
    - [x] **Tab 1:** 👕 Quân trang (Form nhập chiều cao).
    - [x] **Tab 2:** 📅 Lịch học (View Only).
    - [x] **Tab 3:** 📊 Kết quả (View Only).
    - [x] **Tab 4:** 🏠 Thông tin (Phòng, Đơn vị).

### Step 4: Admin Management
- [x] **Basic CRUD:** Quản lý danh sách sinh viên, khóa học, trường học, lịch học.
- [ ] **Import Tool:** UI Upload Excel file sinh viên.
- [ ] **Advanced Features:** Phân quyền, thống kê.

## 📅 Execution Order
- [x] **Backend:** Create Models & Update DB.
- [x] **Backend:** Write Auth & Data APIs.
- [x] **Frontend:** Create `StudentLoginWidget` & Embed into Category Page.
- [x] **Frontend:** Build Dashboard Pages.
- [x] **Admin:** Build CRUD Management Pages.
- [ ] **Admin:** Build Excel Import Tool.
