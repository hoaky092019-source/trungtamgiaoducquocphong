import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";

// --- IMPORT CÁC TRANG PUBLIC ---
import TongQuanPage from "./pages/TongQuanPage";
import TinTucPage from "./pages/TinTucPage";
import LoginPage from "./pages/auth/LoginPage";

// --- IMPORT TRANG DYNAMIC ---
import PostDetailPage from "./pages/PostDetailPage";
import CategoryPostPage from "./pages/CategoryPostPage";

// --- IMPORT LAYOUT ADMIN ---
import ModernAdminLayout from "./layouts/ModernAdminLayout";
import PrivateRoute from "./components/common/PrivateRoute";

// --- IMPORT TRANG ADMIN (ĐÃ MÔ-ĐUN HÓA) ---
// 1. Dashboard
import DashboardPage from "./pages/admin/dashboard/DashboardPage";
import UsersPage from "./pages/admin/users/UsersPage";
import UserFormPage from "./pages/admin/users/UserFormPage";
import FacultiesPage from "./pages/admin/faculties/FacultiesPage";
import FacultyFormPage from "./pages/admin/faculties/FacultyFormPage";
import CategoriesPage from "./pages/admin/categories/CategoriesPage";
import CategoryFormPage from "./pages/admin/categories/CategoryFormPage";
import PostsPage from "./pages/admin/posts/PostsPage";
import PostFormPage from "./pages/admin/posts/PostFormPage";
import FileManagerPage from "./pages/admin/filemanager/FileManagerPage";
import ElFinderPage from "./pages/admin/filemanager/ElFinderPage";

// --- IMPORT STUDENT PORTAL ---
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import StudentSchedulePage from "./pages/student/StudentSchedulePage";
import StudentGradesPage from "./pages/student/StudentGradesPage";
import StudentInfoPage from "./pages/student/StudentInfoPage";

// ... previous imports ...



// --- IMPORT CSS ---
import "./css/site.css";
import "./css/HomePage.css";
import "./css/CategoryPage.css";
import "./css/ModernAdmin.css";
import "./css/AdminCrud.css";
import "./css/AdminForm.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// --- IMPORT AUTHSERVICE ---
import authService from "./services/authService";

function App() {
  // Khởi động kiểm tra tự động token hết hạn
  useEffect(() => {
    const intervalId = authService.startTokenExpirationCheck();

    // Cleanup khi component unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, []);

  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        {/* =========================================
            1. PUBLIC ROUTES (Khách xem)
           ========================================= */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Dynamic Route: Chi tiết bài viết */}
        <Route path="/bai-viet/:slug" element={<PostDetailPage />} />

        {/* Dynamic Route: Danh mục bài viết */}
        <Route path="/danh-muc/:slug" element={<CategoryPostPage />} />

        {/* Nhóm Giới thiệu (Tự động hóa bằng slug) */}
        <Route path="/tong-quan" element={<CategoryPostPage slugOverride="tong-quan" />} />
        <Route path="/ban-giam-doc" element={<CategoryPostPage slugOverride="ban-giam-doc" />} />
        <Route path="/cac-phong-khoa" element={<CategoryPostPage slugOverride="cac-phong-khoa" />} />
        <Route path="/to-chuc" element={<CategoryPostPage slugOverride="to-chuc-doan-the" />} />

        {/* Nhóm Tin tức & Đào tạo */}
        <Route path="/tin-tuc" element={<CategoryPostPage slugOverride="tin-tuc" />} />
        <Route path="/dau-thau" element={<CategoryPostPage slugOverride="thong-tin-dau-thau-moi-chao-gia" />} />
        <Route path="/dao-tao" element={<CategoryPostPage slugOverride="dao-tao" />} />

        {/* =========================================
            3. STUDENT PORTAL ROUTES
           ========================================= */}
        <Route path="/cong-thong-tin-sinh-vien" element={<StudentLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StudentDashboardPage />} />
          <Route path="schedule" element={<StudentSchedulePage />} />
          <Route path="grades" element={<StudentGradesPage />} />
          <Route path="info" element={<StudentInfoPage />} />
        </Route>

        {/* =========================================
            2. ADMIN ROUTES (Quản trị viên)
           ========================================= */}
        {/* =========================================
            2. ADMIN ROUTES (Quản trị viên)
           ========================================= */}
        {/* Route Cha: Chứa Layout (Sidebar + Header) */}
        {/* BẢO VỆ ROUTE: Chỉ cho phép Admin, FacultyAdmin, Teacher vào trang quản trị */}
        <Route element={<PrivateRoute allowedRoles={['Admin', 'FacultyAdmin', 'Teacher']} />}>
          <Route path="/admin" element={<ModernAdminLayout />}>

            {/* Mặc định vào /admin thì chuyển hướng sang dashboard */}
            <Route index element={<Navigate to="dashboard" replace />} />

            {/* Lưu ý: Các path con KHÔNG cần có "/admin/" ở đầu nữa */}

            {/* Dashboard */}
            <Route path="dashboard" element={<DashboardPage />} />

            {/* --- MODULE: NGƯỜI DÙNG (Admin & FacultyAdmin) --- */}
            <Route element={<PrivateRoute allowedRoles={['Admin', 'FacultyAdmin']} />}>
              <Route path="users" element={<UsersPage />} />
              <Route path="users/new" element={<UserFormPage />} />
              <Route path="users/edit/:id" element={<UserFormPage />} />
            </Route>

            {/* --- MODULE: KHOA / BAN (Only Admin) --- */}
            <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
              <Route path="faculties" element={<FacultiesPage />} />
              <Route path="faculties/new" element={<FacultyFormPage />} />
              <Route path="faculties/edit/:id" element={<FacultyFormPage />} />
            </Route>

            {/* --- MODULE: DANH MỤC (Only Admin) --- */}
            <Route element={<PrivateRoute allowedRoles={['Admin']} />}>
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="categories/add" element={<CategoryFormPage />} />
              <Route path="categories/edit/:id" element={<CategoryFormPage />} />
            </Route>

            {/* --- MODULE: BÀI VIẾT (All Permitted) --- */}
            <Route path="posts" element={<PostsPage />} />
            <Route path="posts/add" element={<PostFormPage />} />
            <Route path="posts/edit/:id" element={<PostFormPage />} />

            {/* --- MODULE: QUẢN LÝ FILE (All Permitted) --- */}
            <Route path="file-manager" element={<ElFinderPage />} />

            {/* --- 404 ADMIN --- */}
            <Route path="*" element={<div className="text-center mt-5"><h3>404 - Trang quản trị không tồn tại</h3></div>} />
          </Route>
        </Route>

        {/* 404 PUBLIC */}
        <Route path="*" element={<div className="text-center mt-5"><h3>404 - Trang không tồn tại</h3></div>} />
      </Routes>
    </div>
  );
}

export default App;