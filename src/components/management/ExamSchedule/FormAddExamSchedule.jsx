/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getMajors } from "../../../services/majorService";
import { getSemesters } from "../../../services/semesterService";
import {
  AddExamSchedule,
  getAvailalbeTeacherForAddExamSchedule,
  getSubjectIdsForAddExamSchedule,
} from "../../../services/examScheduleService";
import { GetAvailableRoomToAddExamSchedule } from "../../../services/roomService";

function FormAddExamSchedule({ onClassAdded }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert để thông báo thành công hay thất bại
  const [isFormVisible, setIsFormVisible] = useState(true);

  // State chính của form
  const [formData, setFormData] = useState({
    examScheduleId: 0,
    semesterId: "",
    majorId: "",
    subjectId: "",
    roomId: "",
    date: "",
    startTime: "", // "HH:MM:SS"
    endTime: "",   // "HH:MM:SS"
    type: 0,       // 1 = Lý thuyết, 2 = Thực hành
    turn: 0,       // 1 = Lần đầu, 2 = Lần hai
    teacherId: "",
    status: 0,
    createdAt: "2025-02-28T00:00:00",
  });

  // Lấy danh sách major
  const [majorData, setMajorData] = useState([]);
  useEffect(() => {
    const fetchMajorData = async () => {
      const majorData = await getMajors();
      setMajorData(majorData.result);
    };
    fetchMajorData();
  }, []);

  // Lấy danh sách semester
  const [semesterData, setSemesterData] = useState([]);
  useEffect(() => {
    const fetchSemesterData = async () => {
      const semesterData = await getSemesters();
      setSemesterData(semesterData.result);
    };
    fetchSemesterData();
  }, []);

  // Lấy danh sách môn học tùy theo major + semester
  const [subjectData, setSubjectData] = useState([]);
  useEffect(() => {
    if (formData.majorId && formData.semesterId) {
      const fetchSubjectData = async () => {
        try {
          const subjectResponse = await getSubjectIdsForAddExamSchedule(
            formData.majorId,
            formData.semesterId
          );
          setSubjectData(subjectResponse.result);
        } catch (error) {
          console.error("Error fetching subjects:", error);
        }
      };
      fetchSubjectData();
    }
  }, [formData.majorId, formData.semesterId]);

  // Lấy danh sách phòng khả dụng (theo date, startTime, endTime)
  const [roomData, setRoomData] = useState([]);
  useEffect(() => {
    if (formData.date && formData.startTime && formData.endTime) {
      const fetchRoomData = async () => {
        try {
          const response = await GetAvailableRoomToAddExamSchedule(
            formData.date,
            formData.startTime,
            formData.endTime
          );
          setRoomData(response.result);
        } catch (error) {
          console.error("Error fetching Room:", error);
        }
      };
      fetchRoomData();
    }
  }, [formData.date, formData.startTime, formData.endTime]);

  // Lấy danh sách giáo viên khả dụng (theo date, startTime, endTime)
  const [teacherData, setTeacherData] = useState([]);
  useEffect(() => {
    if (formData.date && formData.startTime && formData.endTime) {
      const fetchTeacherData = async () => {
        try {
          const response = await getAvailalbeTeacherForAddExamSchedule(
            formData.date,
            formData.startTime,
            formData.endTime
          );
          setTeacherData(response.result);
        } catch (error) {
          console.error("Error fetching teacher:", error);
        }
      };
      fetchTeacherData();
    }
  }, [formData.date, formData.startTime, formData.endTime]);

  /**
   * Hàm tiện ích để cộng số phút vào chuỗi "HH:MM:SS".
   * @param {string} timeStr - chuỗi giờ dạng "HH:MM:SS"
   * @param {number} minutesToAdd - số phút cần cộng
   * @returns {string} - chuỗi giờ mới sau khi cộng, cũng dạng "HH:MM:SS"
   */
  const addMinutesToTime = (timeStr, minutesToAdd) => {
    // timeStr: "HH:MM:SS"
    const [hh, mm, ss] = timeStr.split(":").map((p) => parseInt(p, 10));
    // Tính tổng phút
    const totalStartMinutes = hh * 60 + mm;
    const resultMinutes = totalStartMinutes + minutesToAdd;
    // Chuyển lại thành HH:MM
    let newH = Math.floor(resultMinutes / 60);
    let newM = resultMinutes % 60;

    // Giữ giây = ss (thường = 0), tuỳ ý
    // Nếu bạn luôn muốn :00, có thể đặt = 0
    // newH, newM có thể vượt 24h -> logic tuỳ
    // Ở đây đơn giản wrap 0-23
    newH = newH % 24;

    // Format dạng "HH:MM:SS"
    const hhStr = newH.toString().padStart(2, "0");
    const mmStr = newM.toString().padStart(2, "0");
    const ssStr = ss.toString().padStart(2, "0");

    return `${hhStr}:${mmStr}:${ssStr}`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    // Chuyển sang number nếu là type hoặc turn
    if (name === "type" || name === "turn") {
      newValue = parseInt(value, 10);
    }

    // Nếu là startTime hoặc endTime => format "HH:MM:00"
    if (name === "startTime" || name === "endTime") {
      newValue = `${value}:00`; // "HH:MM" + ":00" => "HH:MM:00"
    }

    // Cập nhật state trước
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Nếu user thay đổi 'type' hoặc 'startTime', tự động gán endTime
    //   => +80 phút nếu type=1, +120 phút nếu type=2
    if ((name === "type" && newValue !== 0) || name === "startTime") {
      setFormData((prev) => {
        // Nếu startTime còn rỗng, bỏ qua
        if (!prev.startTime) return { ...prev };

        let typeVal = prev.type;
        // Nếu name === 'type', typeVal = newValue (vì state chưa kịp update)
        if (name === "type") {
          typeVal = newValue;
        }

        // Xác định số phút cần cộng
        let extraMinutes = 0;
        if (typeVal === 1) {
          extraMinutes = 80;
        } else if (typeVal === 2) {
          extraMinutes = 120;
        }

        // Tính endTime mới
        const newEnd = addMinutesToTime(prev.startTime, extraMinutes);
        return { ...prev, endTime: newEnd };
      });
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AddExamSchedule(formData);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        onClassAdded(response.slot);
        setTimeout(() => setShowAlert(false), 3000);
        setIsFormVisible(false);
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (error) {
      console.error("Error adding room:", error);
    }
  };

  return (
    <>
      {/* Alert hiển thị thông báo Start */}
      {showAlert && (
        <div
          className={`fixed top-5 right-0 z-50 ${
            showAlert === "error"
              ? "animate-slide-in text-red-800 bg-red-50 border-red-300 mr-4"
              : "animate-slide-in text-green-800 bg-green-50 border-green-300 mr-4"
          } border rounded-lg p-4`}
        >
          <div className="flex items-center">
            <svg
              className="flex-shrink-0 inline w-4 h-4 me-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 1 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>
              {showAlert === "error" ? (
                <span>
                  <strong>Lỗi:</strong> {errorMessage}
                </span>
              ) : (
                <span>
                  <strong>Thành Công:</strong> {successMessage}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Alert hiển thị thông báo End */}

      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white border w-full max-w-[700px] h-auto rounded-2xl items-center text-center shadow-xl">
            <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
              Thêm lịch thi
            </p>
            <form onSubmit={handleSubmit}>
              <p className="text-left ml-[100px] text-xl mt-5">
                Chọn chuyên ngành:
              </p>
              <select
                name="majorId"
                value={formData.majorId}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              >
                <option value="" disabled>
                  Chọn chuyên ngành
                </option>
                {majorData.map((major) => (
                  <option key={major.majorId} value={major.majorId}>
                    {major.majorName}
                  </option>
                ))}
              </select>

              <p className="text-left ml-[100px] text-xl">Kỳ học:</p>
              <select
                name="semesterId"
                value={formData.semesterId}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              >
                <option value="" disabled>
                  Chọn kỳ học
                </option>
                {semesterData.map((semester) => (
                  <option key={semester.semesterId} value={semester.semesterId}>
                    {semester.semesterName}
                  </option>
                ))}
              </select>

              <p className="text-left ml-[100px] text-xl ">Chọn môn học :</p>
              <select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              >
                <option value="" disabled>
                  Chọn môn học
                </option>
                {subjectData.map((subject) => (
                  <option
                    key={subject.classSubjectId}
                    value={subject.subjectId}
                  >
                    {subject.subjectId}
                  </option>
                ))}
              </select>

              <p className="text-left ml-[100px] text-xl ">Chọn Loại Thi :</p>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              >
                <option value="0" disabled>
                  Chọn Loại Thi
                </option>
                <option value="1">Thi Lý Thuyết</option>
                <option value="2">Thi Thực Hành</option>
              </select>

              <p className="text-left ml-[100px] text-xl ">Chọn Lần Thi :</p>
              <select
                name="turn"
                value={formData.turn}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              >
                <option value="0" disabled>
                  Chọn Lần Thi
                </option>
                <option value="1">Thi lần đầu</option>
                <option value="2">Thi lại lần hai</option>
              </select>

              <p className="text-left ml-[100px] text-xl ">Ngày Thi:</p>
              <input
                name="date"
                type="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              />

              <p className="text-left ml-[100px] text-xl ">Thời gian bắt đầu:</p>
              <input
                name="startTime"
                type="time"
                value={formData.startTime.replace(":00", "")} 
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              />

              <p className="text-left ml-[100px] text-xl ">Thời gian kết thúc:</p>
              <input
                name="endTime"
                type="time"
                // Hiển thị cắt bỏ ":00" nếu có
                value={formData.endTime.replace(":00", "")}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              />

              <p className="text-left ml-[100px] text-xl ">Chọn phòng thi :</p>
              <select
                name="roomId"
                value={formData.roomId}
                onChange={handleInputChange}
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              >
                <option value="" disabled>
                  Chọn phòng thi
                </option>
                {roomData.map((room) => (
                  <option key={room.roomId} value={room.roomId}>
                    {room.roomId} - {room.location}
                  </option>
                ))}
              </select>

              <p className="text-left ml-[100px] text-xl ">Chọn giáo viên :</p>
              <select
                name="teacherId"
                value={formData.teacherId}
                onChange={handleInputChange}
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              >
                <option value="" disabled>
                  Chọn giáo viên
                </option>
                {teacherData.map((teacher) => (
                  <option key={teacher.userId} value={teacher.userId}>
                    {teacher.lastName} {teacher.middleName} {teacher.firstName} -{" "}
                    {teacher.majorId}
                  </option>
                ))}
              </select>

              <div className="flex flex-wrap justify-center gap-4 mt-4 mb-4">
                <button
                  type="submit"
                  className="w-full max-w-[200px] h-[40px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg transition-all hover:scale-105 hover:bg-primaryBlue"
                >
                  Thêm
                </button>
                <button
                  type="button"
                  className="w-full max-w-[200px] h-[40px] border rounded-3xl bg-red-500 text-white font-bold text-lg transition-all hover:scale-105 hover:bg-red-700"
                  onClick={handleCancel}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default FormAddExamSchedule;
