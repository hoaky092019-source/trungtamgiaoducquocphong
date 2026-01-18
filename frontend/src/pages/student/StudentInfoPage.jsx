import React from 'react';

const StudentInfoPage = () => {
    // Get info from localStorage if available mock
    const student = JSON.parse(localStorage.getItem('studentInfo') || '{}');

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold text-primary">
                    <i className="fa-solid fa-circle-info me-2"></i> Thông tin cá nhân
                </h5>
            </div>
            <div className="card-body p-4">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="text-muted small text-uppercase fw-bold">Họ và tên</label>
                        <p className="fw-medium fs-5">{student.fullName || '---'}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="text-muted small text-uppercase fw-bold">MSSV</label>
                        <p className="fw-medium fs-5">{student.studentCode || '---'}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="text-muted small text-uppercase fw-bold">Trường</label>
                        <p className="fw-medium fs-5">{student.schoolName || '---'}</p>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="text-muted small text-uppercase fw-bold">Khóa học</label>
                        <p className="fw-medium fs-5">{student.courseName || '---'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentInfoPage;
