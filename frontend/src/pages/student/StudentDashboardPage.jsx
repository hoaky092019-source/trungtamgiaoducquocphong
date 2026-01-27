import React, { useState, useEffect } from 'react';
import studentService from '../../services/studentService';

const StudentDashboardPage = () => {
    const [student, setStudent] = useState(null);
    const [uniformSize, setUniformSize] = useState('M');
    const [height, setHeight] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const info = localStorage.getItem('studentInfo');
        if (info) {
            setStudent(JSON.parse(info));
        }
    }, []);

    const handleSaveUniform = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await studentService.updateUniform({
                height: parseInt(height),
                uniformSize: uniformSize
            });

            // Update Local Storage
            const updatedStudent = { ...student, height: parseInt(height), uniformSize: uniformSize };
            setStudent(updatedStudent);
            localStorage.setItem('studentInfo', JSON.stringify(updatedStudent));

            alert("Cập nhật thông tin quân trang thành công!");
        } catch (error) {
            console.error(error);
            alert("Có lỗi xảy ra khi lưu thông tin!");
        } finally {
            setLoading(false);
        }
    };

    if (!student) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    const sizes = [
        { label: 'S', desc: 'Dưới 1m60' },
        { label: 'M', desc: '1m60 - 1m68' },
        { label: 'L', desc: '1m69 - 1m75' },
        { label: 'XL', desc: '1m76 - 1m80' },
        { label: 'XXL', desc: 'Trên 1m80' },
    ];

    return (
        <div className="space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
                <div className="relative z-10">
                    <h1 className="text-2xl font-bold text-slate-800">
                        Xin chào, <span className="text-indigo-600">{student.fullName}</span> 👋
                    </h1>
                    <p className="text-slate-500 mt-1">Chúc bạn một kỳ học quân sự thật ý nghĩa và bổ ích!</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Mã sinh viên</div>
                    <div className="font-mono font-bold text-slate-700">{student.studentCode}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Đơn vị</div>
                    <div className="font-semibold text-slate-700">{student.schoolName}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Đại đội</div>
                    <div className="font-semibold text-slate-700">{student.company || 'Chưa xếp'}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider mb-1">Phòng ở</div>
                    <div className="font-semibold text-slate-700">
                        {student.building ? `${student.building} - ${student.roomNumber}` : 'Chưa xếp'}
                    </div>
                </div>
            </div>

            {/* Uniform Registration Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                <div className="bg-slate-50/50 p-6 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                            <i className="fa-solid fa-shirt text-lg"></i>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Đăng ký Quân trang</h2>
                            <p className="text-sm text-slate-500">Cập nhật thông tin để nhận quân phục đúng kích cỡ</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <form onSubmit={handleSaveUniform}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Height Input */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">Chiều cao của bạn (cm)</label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none font-medium text-lg"
                                        placeholder="Ví dụ: 170"
                                        required
                                    />
                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">cm</span>
                                </div>
                                <p className="text-xs text-slate-400 mt-2 ml-1">
                                    * Vui lòng nhập chiều cao chính xác để được cấp phát quân trang phù hợp.
                                </p>
                            </div>

                            {/* Size Selection */}
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-3">Chọn size quân phục</label>
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {sizes.map((s) => (
                                        <div
                                            key={s.label}
                                            onClick={() => setUniformSize(s.label)}
                                            className={`
                                                cursor-pointer rounded-xl border-2 p-3 text-center transition-all duration-200 relative overflow-hidden group
                                                ${uniformSize === s.label
                                                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm'
                                                    : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50 text-slate-600'}
                                            `}
                                        >
                                            <div className="font-bold text-lg mb-1">{s.label}</div>
                                            <div className="text-[10px] opacity-70 font-medium">{s.desc}</div>
                                            {uniformSize === s.label && (
                                                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-600"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all transform active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <i className="fa-solid fa-spinner fa-spin"></i>
                                        <span>Đang lưu...</span>
                                    </>
                                ) : (
                                    <>
                                        <i className="fa-solid fa-check"></i>
                                        <span>Lưu thông tin</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboardPage;
