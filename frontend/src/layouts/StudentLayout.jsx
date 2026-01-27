import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import MainLayout from './MainLayout';

const StudentLayout = () => {
    const navigate = useNavigate();

    // Check auth
    useEffect(() => {
        const token = localStorage.getItem('studentToken');
        if (!token) {
            navigate('/danh-muc/cong-ttdt-sinh-vien');
        }
    }, [navigate]);

    return (
        <MainLayout>
            <div className="container my-5">
                <Outlet />
            </div>
        </MainLayout>
    );
};

export default StudentLayout;
