import { useState, useEffect } from "react";
import { GetStudentDataByClassId } from "../../../services/studentInClassService";
import { useParams } from "react-router-dom";
import Avatar from "../../../assets/Imgs/avatar_square.jpg";

function StudentDetailClass() {
  const [studentData, setStudentData] = useState([]);
  const [error, setError] = useState(null);
  const { classSubjectId } = useParams(); // Lấy classId, classSubjectId từ URL

  useEffect(() => {
    const fetchStudentDetailClass = async () => {
      try {
        setError(null);
        const data = await GetStudentDataByClassId(classSubjectId);
        if (Array.isArray(data.result) && data.isSuccess) {
          // data.result = [];
          if (data.result.length === 0) {
            setError("Không có sinh viên nào trong lớp học này.");
          } else {
            setStudentData(data.result);
          }
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError(error);
      } 
    };
    fetchStudentDetailClass();
  }, []);

  return (
    <div>
      {/* Tiêu đề */}
      <div className="flex justify-center">
        <p className="mt-8 text-3xl font-bold">Xem chi tiết lớp học </p>
      </div>

      {/* Bảng hiển thị */}
      <div className="w-full sm:w-[90%] lg:w-[1570px] mx-auto overflow-x-auto relative flex flex-col mb-4 mt-4 bg-white shadow-md rounded-2xl border border-gray">
        <table className="min-w-full text-left table-auto bg-white">
          <thead className="bg-gray-100 ">
            <tr>
              <th className="p-4 font-semibold text-white text-center align-middle bg-tritenaryGreen">
                STT
              </th>
              <th className="p-4 font-semibold text-white text-center align-middle bg-tritenaryGreen">
                Hình ảnh
              </th>
              <th className="p-4 font-semibold text-white text-center align-middle bg-tritenaryGreen">
                MSSV
              </th>
              <th className="p-4 font-semibold text-white text-center align-middle bg-tritenaryGreen">
                Họ
              </th>
              <th className="p-4 font-semibold text-white text-center align-middle bg-tritenaryGreen">
                Tên đệm
              </th>
              <th className="p-4 font-semibold text-white text-center align-middle bg-tritenaryGreen">
                Tên
              </th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr className="text-center text-red-700">
                <td colSpan={6}>{error}</td>
              </tr>
            )}
            {studentData.map((student, index) => (
              <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                <td className="p-4 text-center align-middle">{index + 1}</td>
                <td className="p-4 text-center align-middle">
                  <img
                    src={student.userAvartar || Avatar}
                    alt="Student Avatar"
                    className="w-16 h-16 mx-auto rounded-2xl"
                  />
                </td>
                <td className="p-4 text-center align-middle">
                  {student.userId}
                </td>
                <td className="p-4 text-center align-middle">
                  {student.lastName}
                </td>
                <td className="p-4 text-center align-middle">
                  {student.middleName}
                </td>
                <td className="p-4 text-center align-middle">
                  {student.firstName}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default StudentDetailClass;
