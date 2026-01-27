import React, { useEffect, useState } from 'react';
import studentService from '../../services/studentService';

const StudentGradesPage = () => {
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGrades = async () => {
            try {
                const res = await studentService.getGrades();
                setGrades(res);
            } catch (error) {
                console.error("Failed to load grades", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGrades();
    }, []);

    // Calculate generic stats
    const totalCredits = grades.reduce((acc, curr) => acc + curr.credits, 0);
    const avgScore = grades.length > 0
        ? (grades.reduce((acc, curr) => acc + (curr.finalScore * curr.credits), 0) / totalCredits).toFixed(2)
        : 0;

    const getGradeColor = (score) => {
        if (score >= 8.5) return 'text-emerald-600 bg-emerald-50 border-emerald-100';
        if (score >= 7.0) return 'text-blue-600 bg-blue-50 border-blue-100';
        if (score >= 5.5) return 'text-indigo-600 bg-indigo-50 border-indigo-100';
        if (score >= 4.0) return 'text-amber-600 bg-amber-50 border-amber-100';
        return 'text-rose-600 bg-rose-50 border-rose-100';
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
                <div className="text-slate-500 font-medium">Đang tải bảng điểm...</div>
            </div>
        </div>
    );

    if (grades.length === 0) return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="fa-solid fa-graduation-cap text-3xl text-slate-300"></i>
            </div>
            <h3 className="text-lg font-bold text-slate-700">Chưa có kết quả học tập</h3>
            <p className="text-slate-500 mt-2">Hiện tại chưa có điểm môn học nào được cập nhật.</p>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Summary Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-1">Kết quả học tập</h2>
                        <p className="text-indigo-100 opacity-90">Tổng quan tình hình học tập của bạn tại trung tâm.</p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-center">
                            <div className="text-3xl font-bold">{grades.length}</div>
                            <div className="text-xs uppercase tracking-wider opacity-75 font-semibold">Môn học</div>
                        </div>
                        <div className="w-px h-10 bg-white/20"></div>
                        <div className="text-center">
                            <div className="text-3xl font-bold">{totalCredits}</div>
                            <div className="text-xs uppercase tracking-wider opacity-75 font-semibold">Tín chỉ</div>
                        </div>
                        <div className="w-px h-10 bg-white/20"></div>
                        <div className="text-center md:text-right">
                            <div className="text-4xl font-extrabold text-amber-300 drop-shadow-sm">{avgScore}</div>
                            <div className="text-xs uppercase tracking-wider opacity-75 font-semibold">Điểm TB</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grades Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100 text-xs uppercase text-slate-500 font-bold tracking-wider">
                                <th className="px-6 py-4">Môn học</th>
                                <th className="px-4 py-4 text-center">Số TC</th>
                                <th className="px-4 py-4 text-center">QT.1</th>
                                <th className="px-4 py-4 text-center">QT.2</th>
                                <th className="px-4 py-4 text-center">Kết thúc</th>
                                <th className="px-4 py-4 text-center">Trạng thái</th>
                                <th className="px-4 py-4 text-center">Chi tiết</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {grades.map((item, index) => (
                                <tr
                                    key={item.id}
                                    className="hover:bg-indigo-50/30 transition-colors duration-150"
                                >
                                    <td className="px-6 py-4 font-semibold text-slate-700">
                                        {item.subjectName}
                                    </td>
                                    <td className="px-4 py-4 text-center text-slate-600 font-medium">
                                        {item.credits}
                                    </td>
                                    <td className="px-4 py-4 text-center text-slate-500">
                                        {item.score1 || '-'}
                                    </td>
                                    <td className="px-4 py-4 text-center text-slate-500">
                                        {item.score2 || '-'}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <span className={`inline-block w-10 py-1 rounded-lg font-bold text-sm ${getGradeColor(item.finalScore)}`}>
                                            {item.finalScore}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        {item.finalScore >= 5 ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                                                <i className="fa-solid fa-check mr-1.5"></i> Đạt
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800">
                                                <i className="fa-solid fa-xmark mr-1.5"></i> Hỏng
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        <button
                                            className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-2 rounded-full transition-colors"
                                            onClick={() => alert(`Chi tiết điểm môn: ${item.subjectName}\n(Tính năng đang phát triển)`)}
                                        >
                                            <i className="fa-solid fa-circle-info text-lg"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-slate-50 border-t border-slate-100 p-4 text-center">
                    <p className="text-xs text-slate-400 italic">
                        * Kết quả học tập được cập nhật chính thức từ Phòng Đào tạo.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default StudentGradesPage;
