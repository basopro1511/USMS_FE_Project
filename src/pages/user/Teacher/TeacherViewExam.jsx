import { useEffect, useState } from "react";
import { getExamScheduleForTeacher } from "../../../services/examScheduleService";
function TeacherViewExam() {
  const [teacherData, setTeacherData] = useState([]);
  //#region Fetch Data

  useEffect(() => {
    const fetchTeacherExamData = async () => {
      const data = await getExamScheduleForTeacher("HieuNT");
      setTeacherData(data.result);
    };
    fetchTeacherExamData();
  }, []);

  //#endregion

  return (
    <div>
      {/* Tiêu đề */}
      <div className="flex justify-center">
        <p className="mt-8 text-3xl font-bold">Xem lịch gác thi</p>
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
            {teacherData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 even:bg-gray-50">
                <td className="p-4 text-center align-middle">{index + 1}</td>
                <td className="p-4 text-center align-middle">
                  {item.subjectId}
                </td>
                <td className="p-4 text-center align-middle">
                  {item.startTime} - {item.endTime}
                </td>
                <td className="p-4 text-center align-middle">{item.date}</td>
                <td className="p-4 text-center align-middle">
                  {item.roomId}
                </td>
                {/* type: 1 -> Lý thuyết, 2 -> Thực hành*/}
                <td className="p-4 text-center align-middle">
                  {item.type === 1
                    ? "Lý thuyết"
                    : item.type === 2
                    ? "Thực hành"
                    : "Không xác định"}
                </td>

                {/* turn: 1 -> Thi lần đầu, 2 -> Thi lần hai */}
                <td className="p-4 text-center align-middle">
                  {item.turn === 1
                    ? "Thi lần đầu"
                    : item.turn === 2
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
export default TeacherViewExam;
