import { useEffect, useState } from "react";
import { getExamScheduleForStudent } from "../../../services/examScheduleService";

function StudentViewExam() {
  const [studentData, setStudentData] = useState([]);
  //#region Fetch Data

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await getExamScheduleForStudent("SE0001");
      setStudentData(data.result);
    };
    fetchUserData();
  }, []);

  //#endregion

  return (
    <div>
      {/* Tiêu đề */}
      <div className="flex justify-center">
        <p className="mt-8 text-3xl font-bold">Xem lịch thi</p>
      </div>

      {/* Bảng hiển thị */}
      <div className="w-full sm:w-[90%] lg:w-[1570px] mx-auto overflow-x-auto relative flex flex-col mb-4 mt-4 bg-white shadow-md rounded-2xl border border-gray">
        <table className="min-w-full text-left table-auto bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">
                STT
              </th>
              <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">
                Mã môn thi
              </th>
              <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">
                Giờ thi
              </th>
              <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">
                Ngày thi
              </th>
              <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">
                Phòng thi
              </th>
              <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">
                Kiểu thi
              </th>
              <th className="p-4 font-semibold text-white text-center align-middle bg-secondaryBlue">
                Đợt thi
              </th>
       
            </tr>
          </thead>
          <tbody>
            {studentData.map((student, index) => (
              <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                <td className="p-4 text-center align-middle">{index + 1}</td>
                <td className="p-4 text-center align-middle">
                  {student.subjectId}
                </td>
                <td className="p-4 text-center align-middle">
                  {student.startTime} - {student.endTime}
                </td>
                <td className="p-4 text-center align-middle">{student.date}</td>
                <td className="p-4 text-center align-middle">
                  {student.roomId}
                </td>
                {/* type: 1 -> Lý thuyết, 2 -> Thực hành*/}
                <td className="p-4 text-center align-middle">
                  {student.type === 1
                    ? "Lý thuyết"
                    : student.type === 2
                    ? "Thực hành"
                    : "Không xác định"}
                </td>

                {/* turn: 1 -> Thi lần đầu, 2 -> Thi lần hai */}
                <td className="p-4 text-center align-middle">
                  {student.turn === 1
                    ? "Thi lần đầu"
                    : student.turn === 2
                    ? "Thi lần hai"
                    : "Không xác định"}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentViewExam;
