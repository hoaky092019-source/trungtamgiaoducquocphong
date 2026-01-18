import React, { useState, useEffect } from 'react';

const StudentDashboardPage = () => {
    const [student, setStudent] = useState(null);
    const [uniformSize, setUniformSize] = useState('M');
    const [height, setHeight] = useState('');

    useEffect(() => {
        const info = localStorage.getItem('studentInfo');
        if (info) {
            setStudent(JSON.parse(info));
        }
    }, []);

    const handleSaveUniform = (e) => {
        e.preventDefault();
        alert(`Đã lưu thông tin: Cao ${height}cm, Size ${uniformSize}`);
    };

    if (!student) return <div>Loading...</div>;

    return (
        <div className="card shadow-sm border-0">
            <div className="card-header bg-white py-3">
                <h5 className="mb-0 fw-bold text-primary">
                    <i className="fa-solid fa-shirt me-2"></i> Đăng ký quân trang
                </h5>
            </div>
            <div className="card-body p-4">
                <div className="alert alert-info">
                    <i className="fa-solid fa-circle-info me-2"></i>
                    Vui lòng cập nhật chiều cao và size quân trang chính xác để trung tâm chuẩn bị.
                </div>

                <div className="row">
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label fw-medium">Họ và tên</label>
                            <input type="text" className="form-control bg-light" value={student.fullName} readOnly />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-medium">Mã số sinh viên</label>
                            <input type="text" className="form-control bg-light" value={student.studentCode} readOnly />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label fw-medium">Trường</label>
                            <input type="text" className="form-control bg-light" value={student.schoolName} readOnly />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-medium">Khóa học</label>
                            <input type="text" className="form-control bg-light" value={student.courseName} readOnly />
                        </div>
                    </div>
                </div>

                <hr className="my-4" />

                <form onSubmit={handleSaveUniform}>
                    <div className="row align-items-end">
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Chiều cao (cm) <span className="text-danger">*</span></label>
                            <input
                                type="number"
                                className="form-control"
                                placolder="VD: 170"
                                required
                                value={height}
                                onChange={(e) => setHeight(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label fw-bold">Size quân phục <span className="text-danger">*</span></label>
                            <select
                                className="form-select"
                                value={uniformSize}
                                onChange={(e) => setUniformSize(e.target.value)}
                            >
                                <option value="S">S (Dưới 1m60)</option>
                                <option value="M">M (1m60 - 1m68)</option>
                                <option value="L">L (1m69 - 1m75)</option>
                                <option value="XL">XL (1m76 - 1m80)</option>
                                <option value="XXL">XXL (Trên 1m80)</option>
                            </select>
                        </div>
                        <div className="col-md-4 mb-3">
                            <button type="submit" className="btn btn-primary w-100 fw-bold">
                                <i className="fa-solid fa-floppy-disk me-2"></i> Lưu thông tin
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StudentDashboardPage;
