/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { getSemesters } from "../../../services/semesterService";
import { getMajors } from "../../../services/majorService";
import {
  GetAvailableRoomToAddExamSchedule,
  getAvailalbeTeacherForAddExamSchedule,
  getSubjectIdsForAddExamSchedule,
  UpdateExamSchedule,
} from "../../../services/examScheduleService";

// eslint-disable-next-line react/prop-types
function FormUpdateExamSchedule({ examScheduleToUpdate, onClassUpdated }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert để thông báo thành công hay thất bại

  const [isFormVisible, setIsFormVisible] = useState(true); // State để điều khiển việc hiển thị form
  const handleCancel = () => {
    setIsFormVisible(false); // Ẩn form khi nhấn nút hủy
  };

  // Dữ liệu lớp học
  const [examData, setExamData] = useState(
    examScheduleToUpdate || {
      examScheduleId: 0,
      semesterId: "",
      majorId: "",
      subjectId: "",
      roomId: "",
      date: "",
      startTime: "", // "HH:MM:SS"
      endTime: "", // "HH:MM:SS"
      type: 0, // 1 = Lý thuyết, 2 = Thực hành
      turn: 0, // 1 = Lần đầu, 2 = Lần hai
      teacherId: "",
      status: 0,
      createdAt: "2025-02-28T00:00:00",
    }
  );
  // Fetch Data Major - Start
  const [majorData, setMajorData] = useState([]);
  useEffect(() => {
    const fetchMajorData = async () => {
      const majorData = await getMajors(); //Lấy ra list room rtong database
      setMajorData(majorData.result);
    };
    fetchMajorData();
  }, []);
  //Fetch Data Major - End

  // Fetch Data Semester - Start
  const [semesterData, setSemesterData] = useState([]);
  useEffect(() => {
    const fetchSemesterData = async () => {
      const semesterData = await getSemesters(); //Lấy ra list room rtong database
      setSemesterData(semesterData.result);
    };
    fetchSemesterData();
  }, []);
  //Fetch Data Major - End

  // Fetch Data Subjcet - Start
  const [subjectData, setSubjectData] = useState([]);
  useEffect(() => {
    if (examData.majorId !== "" && examData.semesterId !== "") {
      const fetchSubjectData = async () => {
        try {
          const subjectResponse = await getSubjectIdsForAddExamSchedule(
            examData.majorId,
            examData.semesterId
          );
          if (subjectResponse && subjectResponse.result) {
            setSubjectData(subjectResponse.result);
          } else {
            setSubjectData([]);
          }
        } catch (error) {
          console.error("Error fetching subjects:", error);
        }
      };
      fetchSubjectData();
    }
  }, [examData.majorId, examData.semesterId]);
  
  //Fetch Data Major - End

  // Lấy danh sách phòng khả dụng (theo date, startTime, endTime)
  const [roomData, setRoomData] = useState([]);

  useEffect(() => {
    if (examData.date && examData.startTime && examData.endTime) {
      const fetchRoomData = async () => {
        try {
          const response = await GetAvailableRoomToAddExamSchedule(
            examData.date,
            examData.startTime,
            examData.endTime
          );
          setRoomData(response.result);
        } catch (error) {
          console.error("Error fetching Room:", error);
        }
      };
      fetchRoomData();
    }
  }, [examData.date, examData.startTime, examData.endTime]);
  // Lấy danh sách giáo viên khả dụng (theo date, startTime, endTime)
  const [teacherData, setTeacherData] = useState([]);
  useEffect(() => {
    if (examData.date && examData.startTime && examData.endTime) {
      const fetchTeacherData = async () => {
        try {
          const response = await getAvailalbeTeacherForAddExamSchedule(
            examData.date,
            examData.startTime,
            examData.endTime
          );
          setTeacherData(response.result);
        } catch (error) {
          console.error("Error fetching teacher:", error);
        }
      };
      fetchTeacherData();
    }
  }, [examData.date, examData.startTime, examData.endTime]);

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
    setExamData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Nếu user thay đổi 'type' hoặc 'startTime', tự động gán endTime
    //   => +80 phút nếu type=1, +120 phút nếu type=2
    if ((name === "type" && newValue !== 0) || name === "startTime") {
      setExamData((prev) => {
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

  useEffect(() => {
    if (examScheduleToUpdate) {
      setExamData(examScheduleToUpdate);
    }
  }, [examScheduleToUpdate]);

  // Xử lý form Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API cập nhật lớp học
      const response = await UpdateExamSchedule(examData);
      if (response.isSuccess) {
        setShowAlert("success");
        setSuccessMessage(response.message);
        onClassUpdated(response.data); // Trả về dữ liệu mới nhất
        setTimeout(() => setShowAlert(false), 3000); // Ẩn bảng thông báo sau 3 giây
        setIsFormVisible(false); // Ẩn form
      } else {
        setShowAlert("error");
        setErrorMessage(response.message);
        setTimeout(() => setShowAlert(false), 3000); // Ẩn bảng thông báo sau 3 giây
      }
    } catch (error) {
      console.error("Error updating class:", error);
    }
  };

  return (
    <>
      {/* Thông báo Start */}
      {showAlert && (
        <div
          className={`fixed top-5 right-0 z-50 ${
            showAlert === "error"
              ? "animate-slide-in text-red-800 bg-red-50 border-red-300 mr-4"
              : "animate-slide-in text-green-800 bg-green-50 border-green-300 mr-4"
          } border rounded-lg p-4`}
        >
          <div className="flex items-center">
            <span>
              {showAlert === "error" ? (
                <strong>Lỗi:  <span className="mr-1"></span></strong>
              ) : (
                <strong>Thành Công: <span className="mr-1"></span></strong>
              )}
            </span>{"  "}
            {showAlert === "error" ? errorMessage : successMessage}
          </div>
        </div>
      )}
      {/* Thông báo End */}

      {isFormVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white border w-full max-w-[700px] h-auto rounded-2xl items-center text-center shadow-xl">
            <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
              Cập nhật lịch thi
            </p>
            <form onSubmit={handleSubmit}>
              {/* Mã số lớp học */}
              <p className="text-left ml-[100px] text-xl mt-5">
                Chọn chuyên ngành:
              </p>
              <select
                name="majorId"
                value={examData.majorId}
                onChange={handleInputChange}
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              >
                <option value="" disabled>
                  Chọn chuyên ngành
                </option>
                {majorData.map((major) => (
                  <option
                    key={major.majorId}
                    value={major.majorId}
                    disabled
                    selected
                  >
                    {major.majorName}
                  </option>
                ))}
              </select>

              <p className="text-left ml-[100px] text-xl">Kỳ học:</p>
              <select
                name="semesterId"
                value={examData.semesterId}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              >
                <option value="" disabled>
                  Chọn kỳ học
                </option>
                {semesterData.map((semester) => (
                  <option
                    key={semester.semesterId}
                    value={semester.semesterId}
                    disabled
                    selected
                  >
                    {semester.semesterName}
                  </option>
                ))}
              </select>

              <p className="text-left ml-[100px] text-xl ">Chọn môn học :</p>
              <select
                name="subjectId"
                value={examData.subjectId}
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
                    disabled
                    selected
                  >
                    {subject.subjectId}
                  </option>
                ))}
              </select>

              <p className="text-left ml-[100px] text-xl ">Chọn Loại Thi :</p>
              <select
                name="type"
                value={examData.type}
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
                value={examData.turn}
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
                value={examData.date}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              />

              <p className="text-left ml-[100px] text-xl ">
                Thời gian bắt đầu:
              </p>
              <input
                name="startTime"
                type="time"
                value={examData.startTime.replace(":00", "")}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              />

              <p className="text-left ml-[100px] text-xl ">
                Thời gian kết thúc:
              </p>
              <input
                name="endTime"
                type="time"
                // Hiển thị cắt bỏ ":00" nếu có
                value={examData.endTime.replace(":00", "")}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              />

              <p className="text-left ml-[100px] text-xl ">Chọn phòng thi :</p>
              <select
                name="roomId"
                value={examData.roomId}
                onChange={handleInputChange}
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              >
                <option value="" disabled>
                  Chọn phòng thi
                </option>
                <option value={examData.roomId}>{examData.roomId}</option>
                {roomData.map((room) => (
                  <option key={room.roomId} value={room.roomId}>
                    {room.roomId} - {room.location}
                  </option>
                ))}
              </select>
              <p className="text-left ml-[100px] text-xl ">Chọn giáo viên :</p>
              <select
                name="teacherId"
                value={examData.teacherId}
                onChange={handleInputChange}
                className="w-full max-w-[500px] h-[40px] text-black border border-black rounded-xl px-4"
              >
                <option value="" disabled>
                  Chọn giáo viên
                </option>
                <option value={examData.teacherId}>{examData.teacherId}</option>
                {teacherData.map((teacher) => (
                  <option key={teacher.userId} value={teacher.userId}>
                    {teacher.lastName} {teacher.middleName} {teacher.firstName}{" "}
                    - {teacher.majorId}
                  </option>
                ))}
              </select>
              {/* Trạng thái */}
              <p className="text-left ml-[100px] text-xl">Trạng thái</p>
              <select
                name="status"
                value={examData.status}
                onChange={handleInputChange}
                required
                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
              >
                <option value="" disabled selected>
                  Chọn trạng thái:
                </option>
                <option value="0">Chưa bắt đầu</option>
                <option value="1">Đang diễn ra</option>
                <option value="2">Đã kết thúc</option>
              </select>

              <div className="flex flex-wrap justify-center gap-4 mt-4 mb-4">
                <button
                  type="submit"
                  className="w-full max-w-[200px] h-[50px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg transition-all hover:scale-105 hover:bg-primaryBlue"
                >
                  Thêm
                </button>
                <button
                  type="button"
                  className="w-full max-w-[200px] h-[50px] border rounded-3xl bg-red-500 text-white font-bold text-lg transition-all hover:scale-105 hover:bg-red-700"
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

export default FormUpdateExamSchedule;
