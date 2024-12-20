import { useState, useEffect } from "react";

function FormDetailTeacher({ teacherDetail }) {
    const [teacherData, setTeacherData] = useState({
        teacherId: "",
        major: "",
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        createdAt: "",
        updatedAt: "",
    });

    // Cập nhật dữ liệu khi teacherDetail thay đổi
    useEffect(() => {
        if (teacherDetail) {
            console.log("Teacher Detail Received:", teacherDetail);

            setTeacherData({
                teacherId: teacherDetail.teacherId || "",
                major: teacherDetail.major || "",
                firstName: teacherDetail.firstName || "",
                middleName: teacherDetail.middleName || "",
                lastName: teacherDetail.lastName || "",
                email: teacherDetail.email || "",
                phoneNumber: teacherDetail.phoneNumber || "",
                dateOfBirth: teacherDetail.dateOfBirth || "",
                createdAt: teacherDetail.createdAt || "",
                updatedAt: teacherDetail.updatedAt || "",
            });
        }
    }, [teacherDetail]);

    const [isFormVisible, setIsFormVisible] = useState(true);
    const handleCancel = () => {
        setIsFormVisible(false);
    };

    return (
        <>
            {isFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white border w-full max-w-[900px] rounded-2xl items-center text-center shadow-xl">
                        <div>
                            <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
                                Xem Chi Tiết Giáo Viên
                            </p>
                            <form className="flex flex-col items-center gap-4 mt-8">
                                <div className="flex gap-8">
                                    <div>
                                        <div className="mb-4">
                                            <img
                                                src="https://via.placeholder.com/150"
                                                alt="Upload Preview"
                                                className="w-[180px] h-[220px] object-cover rounded-md"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex gap-4">
                                            <div>
                                                <p className="text-left">Mã số Giáo Viên:</p>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                    value={teacherData.teacherId}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-left">Chuyên ngành:</p>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                    value={teacherData.major}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div>
                                                <p className="text-left">Họ:</p>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                    value={teacherData.lastName}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-left">Tên đệm:</p>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                    value={teacherData.middleName}
                                                />
                                            </div>
                                            <div>
                                                <p className="text-left">Tên:</p>
                                                <input
                                                    type="text"
                                                    readOnly
                                                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                    value={teacherData.firstName}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-left">Gmail:</p>
                                            <input
                                                type="email"
                                                readOnly
                                                className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                value={teacherData.email}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-left">Số điện thoại:</p>
                                            <input
                                                type="text"
                                                readOnly
                                                className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                value={teacherData.phoneNumber}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-left">Ngày sinh:</p>
                                            <input
                                                type="date"
                                                readOnly
                                                className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                value={teacherData.dateOfBirth}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-left">Ngày tạo:</p>
                                            <input
                                                type="date"
                                                readOnly
                                                className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                value={teacherData.createdAt}
                                            />
                                        </div>
                                        <div>
                                            <p className="text-left">Ngày cập nhật:</p>
                                            <input
                                                type="date"
                                                readOnly
                                                className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                value={teacherData.updatedAt}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-8 mt-3 mb-8">
                                    <button
                                        type="button"
                                        className="w-[150px] h-[50px] bg-[#508696] text-white rounded-md font-bold"
                                        onClick={handleCancel}
                                    >
                                        Quay lại
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default FormDetailTeacher;
