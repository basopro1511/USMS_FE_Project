import { useState } from "react";
function TeacherDetailClass() {
    const [studentData, setStudentData] = useState([
        { sTT: "1", studentId: "ThangNT", userAvatar: "https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg", mSSV: "CE160815", lastName: "Nguyễn", middleName: "Toàn", firstName: "Thắng" },
        { sTT: "2", studentId: "ThangNT", userAvatar: "https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg", mSSV: "CE160815", lastName: "Nguyễn", middleName: "Toàn", firstName: "Thắng" },
        { sTT: "3", studentId: "ThangNT", userAvatar: "https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg", mSSV: "CE160815", lastName: "Nguyễn", middleName: "Toàn", firstName: "Thắng" },
        { sTT: "4", studentId: "ThangNT", userAvatar: "https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg", mSSV: "CE160815", lastName: "Nguyễn", middleName: "Toàn", firstName: "Thắng" },
        { sTT: "5", studentId: "ThangNT", userAvatar: "https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg", mSSV: "CE160815", lastName: "Nguyễn", middleName: "Toàn", firstName: "Thắng" },
        { sTT: "6", studentId: "ThangNT", userAvatar: "https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg", mSSV: "CE160815", lastName: "Nguyễn", middleName: "Toàn", firstName: "Thắng" },
        { sTT: "7", studentId: "ThangNT", userAvatar: "https://i.pinimg.com/736x/c2/b1/36/c2b1367627ae11fc45f6e1d51d9efd13.jpg", mSSV: "CE160815", lastName: "Nguyễn", middleName: "Toàn", firstName: "Thắng" },
    ]);

    return (
        <div>
            {/* Tiêu đề */}
            <div className="flex justify-center">
                <p className="mt-8 text-3xl font-bold">
                    Xem chi tiết lớp học
                </p>
            </div>
            {/* Bảng hiển thị */}
            <div className="w-full sm:w-[90%] lg:w-[1570px] mx-auto overflow-x-auto relative flex flex-col mb-4 mt-4 bg-white shadow-md rounded-2xl border border-gray">
                <table className="min-w-full text-left table-auto bg-white">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">STT</th>
                            <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">Hình ảnh</th>
                            <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">MSSV</th>
                            <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">Họ</th>
                            <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">Tên đệm</th>
                            <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">Tên</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentData.map((student, index) => (
                            <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                                <td className="p-4 text-center align-middle">{student.sTT}</td>
                                <td className="p-4 text-center align-middle">
                                    <img
                                        src={student.userAvatar}
                                        alt="Student Avatar"
                                        className="w-16 h-16 mx-auto"
                                    />
                                </td>
                                <td className="p-4 text-center align-middle">{student.mSSV}</td>
                                <td className="p-4 text-center align-middle">{student.lastName}</td>
                                <td className="p-4 text-center align-middle">{student.middleName}</td>
                                <td className="p-4 text-center align-middle">{student.firstName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
export default TeacherDetailClass;