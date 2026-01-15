import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import authService from '../../services/authService';

const PrivateRoute = ({ allowedRoles = [] }) => {
    const user = authService.getCurrentUser();

    // 1. Check Authentication
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Check Authorization (Role)
    // Supports case-insensitive matching because backend returns PascalCase or match user Input
    const userRole = (user.roleName || user.RoleName || "Guest");

    // If allowedRoles is empty, we assume any authenticated user is allowed (or just Admin?)
    // But better to be explicit.

    if (allowedRoles.length > 0) {
        const hasPermission = allowedRoles.includes(userRole);
        if (!hasPermission) {
            return (
                <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
                    <div className="text-center p-5 bg-white shadow rounded">
                        <h1 className="text-danger fw-bold display-1">403</h1>
                        <h3 className="mb-4">Truy cập bị từ chối</h3>
                        <p className="mb-4">Bạn không có quyền truy cập trang này. <br /> Vai trò hiện tại của bạn: <strong>{userRole}</strong></p>
                        <a href="/" className="btn btn-primary">Về trang chủ</a>
                    </div>
                </div>
            );
        }
    }

    // 3. Render Content
    return <Outlet />;
};

export default PrivateRoute;
