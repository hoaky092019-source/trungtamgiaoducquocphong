import React from 'react';

const StudentSchedulePage = () => {
    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold text-primary">
                    <i className="fa-regular fa-calendar-days me-2"></i> Lịch học tập
                </h5>
            </div>
            <div className="card-body p-5 text-center">
                <img src="https://placehold.co/400x300?text=Lich+Hoc+Tap" alt="Schedule" className="img-fluid mb-3" />
                <p className="text-muted">Chức năng đang được cập nhật dữ liệu...</p>
            </div>
        </div>
    );
};

export default StudentSchedulePage;
