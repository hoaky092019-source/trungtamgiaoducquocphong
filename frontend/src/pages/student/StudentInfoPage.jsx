import React, { useEffect, useState } from 'react';

const StudentInfoPage = () => {
    const [student, setStudent] = useState(null);

    useEffect(() => {
        const info = localStorage.getItem('studentInfo');
        if (info) {
            setStudent(JSON.parse(info));
        }
    }, []);

    if (!student) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    const InfoItem = ({ icon, label, value }) => (
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                <i className={`fa-solid ${icon}`}></i>
            </div>
            <div>
                <p className="text-xs uppercase text-slate-400 font-bold tracking-wider mb-0.5">{label}</p>
                <p className="font-semibold text-slate-700">{value || <span className="text-slate-400 italic">Chưa cập nhật</span>}</p>
            </div>
        </div>
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Digital ID Card */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden sticky top-6">
                    <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                            <div className="w-24 h-24 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center shadow-md">
                                <span className="text-3xl font-bold text-slate-400">
                                    {student.fullName ? student.fullName.charAt(0) : 'S'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="pt-12 pb-8 px-6 text-center">
                        <h2 className="text-xl font-bold text-slate-800">{student.fullName}</h2>
                        <p className="text-slate-500 font-medium">{student.studentCode}</p>

                        <div className="mt-6 flex justify-center gap-2">
                            <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wide border border-indigo-100">
                                {student.schoolName}
                            </span>
                        </div>
                    </div>
                    <div className="bg-slate-50 border-t border-slate-100 p-4">
                        <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                                <div className="text-xs text-slate-400 font-bold uppercase">Giới tính</div>
                                <div className="font-semibold text-slate-700">{student.gender || '-'}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 font-bold uppercase">Ngày sinh</div>
                                <div className="font-semibold text-slate-700">
                                    {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString('vi-VN') : '-'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Detailed Info */}
            <div className="lg:col-span-2 space-y-6">
                {/* Academic Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-graduation-cap text-indigo-500"></i>
                        Thông tin học tập
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <InfoItem icon="fa-school" label="Trường" value={student.schoolName} />
                        <InfoItem icon="fa-layer-group" label="Khóa học" value={student.courseName} />
                        <InfoItem icon="fa-id-card" label="CCCD/CMND" value={student.identificationNumber} />
                        <InfoItem icon="fa-venus-mars" label="Giới tính" value={student.gender} />
                    </div>
                </div>

                {/* Logistics Info */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <i className="fa-solid fa-campground text-emerald-500"></i>
                        Thông tin sinh hoạt
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <InfoItem icon="fa-people-group" label="Đại đội" value={student.company} />
                        <InfoItem icon="fa-users" label="Trung đội/Tiểu đội" value={student.platoon} />
                        <InfoItem icon="fa-building" label="Dãy nhà" value={student.building} />
                        <InfoItem icon="fa-door-open" label="Phòng số" value={student.roomNumber} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentInfoPage;
