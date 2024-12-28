import { useState } from "react";
function TeacherViewExam(){
    const [studentData, setStudentData] = useState([
            {
                examSheduleId: "1",
                subjectId: "PRN231",
                startTime: "09:10",
                endTime: "10:10",
                date: "29/11/2024",
                roomId: "G302",
                status: "Trắc nghiệm",
                periodExam: "1st",
                dateOfpublication: "30/11/2024"
            },
            {
                examSheduleId: "2",
                subjectId: "PRN231",
                startTime: "09:10",
                endTime: "10:10",
                date: "29/11/2024",
                roomId: "G303",
                status: "Tự luận",
                periodExam: "1st",
                dateOfpublication: "30/11/2024"
            },
            {
                examSheduleId: "1",
                subjectId: "PRN231",
                startTime: "09:10",
                endTime: "10:10",
                date: "29/11/2024",
                roomId: "G302",
                status: "Trắc nghiệm",
                periodExam: "2st",
                dateOfpublication: "30/11/2024"
            },
            {
                examSheduleId: "2",
                subjectId: "PRN231",
                startTime: "09:10",
                endTime: "10:10",
                date: "29/11/2024",
                roomId: "G303",
                status: "Tự luận",
                periodExam: "2st",
                dateOfpublication: "30/11/2024"
            },
        ]);
    
        return (
            <div>
                {/* Tiêu đề */}
                <div className="flex justify-center">
                    <p className="mt-8 text-3xl font-bold">
                        Xem lịch thi
                    </p>
                </div>
    
                {/* Bảng hiển thị */}
                <div className="w-full sm:w-[90%] lg:w-[1570px] mx-auto overflow-x-auto relative flex flex-col mb-4 mt-4 bg-white shadow-md rounded-2xl border border-gray">
                    <table className="min-w-full text-left table-auto bg-white">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">STT</th>
                                <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">Mã môn thi</th>
                                <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">Giờ thi</th>
                                <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">Ngày thi</th>
                                <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">Phòng thi</th>
                                <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">Kiểu thi</th>
                                <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">Đợt thi</th>
                                <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">Ngày công bố điểm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {studentData.map((student, index) => (
                                <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                                    <td className="p-4 text-center align-middle">{index + 1}</td>
                                    <td className="p-4 text-center align-middle">{student.subjectId}</td>
                                    <td className="p-4 text-center align-middle">{student.startTime} - {student.endTime}</td>
                                    <td className="p-4 text-center align-middle">{student.date}</td>
                                    <td className="p-4 text-center align-middle">{student.roomId}</td>
                                    <td className="p-4 text-center align-middle">{student.status}</td>
                                    <td className="p-4 text-center align-middle">{student.periodExam}</td>
                                    <td className="p-4 text-center align-middle">{student.dateOfpublication}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
}
export default TeacherViewExam;