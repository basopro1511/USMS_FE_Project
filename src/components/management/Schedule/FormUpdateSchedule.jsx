import { useEffect, useState } from "react";
import { getClassesIdByClassId } from "../../../services/classService";
import { GetAvailableRoom } from "../../../services/roomService";
import {
  getAvailableTeachersForAddSchedule,
  UpdateSchedule,
} from "../../../services/scheduleService";
import { getTeachers } from "../../../services/TeacherService";

// eslint-disable-next-line react/prop-types
function FormUpdateSchedule({dataToUpdate,selectedMajorId,selectedClassId,onAdded,}) {
  //#region State & Error
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert for success or failure notification
  const [isFormVisible, setIsFormVisible] = useState(true); // State to control form visibility
  const [teachers, setTeachers] = useState([]);

  // Dữ liệu cho form
  const [classSubjects, setClassSubjects] = useState([]); // dropdown Lớp-Môn
  const [rooms, setRooms] = useState([]); // dropdown phòng (nếu fetch)

  // Dữ liệu schedule
  const [scheduleData, setNewSchedule] = useState(
    dataToUpdate || {
      scheduleId: 0,
      classSubjectId: 0,
      slotId: 0,
      roomId: "",
      teacherId: "",
      date: "",
      status: 0,
      slotNoInSubject: 0,
    }
  );

  useEffect(() => {
    if (dataToUpdate) {
      setNewSchedule(dataToUpdate);
    }
  }, [dataToUpdate]);

  //#endregion

  //#region Fetch API
  const handleCancel = () => {
    setIsFormVisible(false); // Hide form when cancel is clicked
  };

  //#region  lấy danh sách lớp
  useEffect(() => {
    const fetchClassSubject = async () => {
      const classSubjects = await getClassesIdByClassId(selectedClassId); //Lấy ra list  trong database
      setClassSubjects(classSubjects.result);
    };
    fetchClassSubject();
  }, []);

  //#region  lấy danh sách giáo viên
  useEffect(() => {
    if (scheduleData.date && scheduleData.slotId) {
      const fetchAvailableTeachers = async () => {
        try {
          const teachers = await getAvailableTeachersForAddSchedule(
            selectedMajorId,
            scheduleData.date,
            scheduleData.slotId
          );
          setTeachers(teachers.result);
        } catch (error) {
          console.error("Error fetching subjects:", error);
        }
      };
      fetchAvailableTeachers();
    }
  }, [scheduleData.date, scheduleData.slotId]);

  const [teacherData, setTeacherData] = useState([]);
  const selectedTeacher = teacherData.find(
    (t) => t.userId === scheduleData.teacherId
  );
  // Lấy danh sách Teacher
  useEffect(() => {
    const fetchTeacherData = async () => {
      const data = await getTeachers(); // Lấy danh sách giáo viên
      if (data && data.result) {
        setTeacherData(data.result);
      }
    };
    fetchTeacherData();
  }, []);
  //#endregion

  //#endregion

  //#region lấy danh sách phòng khả dụng
  useEffect(() => {
    if (scheduleData.date && scheduleData.slotId) {
      const fetchAvailableRooms = async () => {
        try {
          const rooms = await GetAvailableRoom(
            scheduleData.date,
            scheduleData.slotId
          );
          const available = rooms.result.filter(
            (item) => item.status === 1
          );
          //  Kiểm tra nếu phòng cũ vẫn tồn tại, giữ lại nó trong danh sách
          const currentRoom = scheduleData.roomId
            ? [{ roomId: scheduleData.roomId, location: "Phòng hiện tại" }]
            : [];
          setRooms([...currentRoom, ...available]);
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      };
      fetchAvailableRooms();
    }
  }, [scheduleData.date, scheduleData.slotId]);

  //#endregion

  //#region handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSchedule((prev) => ({
      ...prev,
      [name]:
        name === "classSubjectId" ||
        name === "slotId" ||
        name === "slotNoInSubject"
          ? Number(value) // Chuyển đổi thành number
          : value,
    }));
  };
  //#endregion

  //#endregion

  //#region Xử lý Submit Form để cập nhật lịch học
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const response = await UpdateSchedule(scheduleData);
      if (response && response.isSuccess) {
        setSuccessMessage(response.message);
        setShowAlert("success");
        setTimeout(() => {
          setShowAlert(false); // Ẩn thông báo sau 3 giây
        }, 3000);
        onAdded(response.data);
        setIsFormVisible(false); // Ẩn form sau khi thông báo biến mất
      } else {
        setErrorMessage(response.message);
        setShowAlert("error");
        setTimeout(() => {
          setShowAlert(false); // Ẩn thông báo sau 3 giây
        }, 3000);
      }
    } catch (error) {
      setErrorMessage("Lỗi hệ thống, vui lòng thử lại!");
      setShowAlert("error");
      console.error("Error updating schedule:", error);
    }
  };

  //#endregion

  return (
    <>
      {/* Notification Start */}
      <>
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
                    <strong>Thất bại:</strong> {errorMessage}
                  </span>
                ) : (
                  <span>
                    <strong>Thành công:</strong> {successMessage}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </>
      {/* Notification End */}

      {/* Form Start */}
      <>
        {isFormVisible && ( // Show form if isFormVisible is true
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white border w-full max-w-[700px] h-auto rounded-2xl items-center text-center shadow-xl">
              <div>
                <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
                  Cập nhật lịch học
                </p>
                <form onSubmit={handleSubmit}>
                  <p className="text-left ml-[100px] text-xl mt-5">
                    Mã lớp - Môn học:
                  </p>
                  <select
                    required
                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                    name="classSubjectId"
                    value={scheduleData.classSubjectId}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn Lớp-Môn --</option>
                    {classSubjects.map((cs) => (
                      <option key={cs.classSubjectId} value={cs.classSubjectId}>
                        {cs.classId} - {cs.subjectId}
                      </option>
                    ))}
                  </select>
                  <p className="text-left ml-[100px] text-xl ">Ngày:</p>
                  <input
                    type="date"
                    required
                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                    name="date"
                    value={scheduleData.date}
                    onChange={handleInputChange}
                  />
                  <p className="text-left ml-[100px] text-xl ">Slot:</p>
                  <select
                    required
                    name="slotId"
                    value={scheduleData.slotId}
                    onChange={handleInputChange}
                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                  >
                    <option value="">-- Chọn Slot --</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                  </select>
                  <p className="text-left ml-[100px] text-xl">Giáo viên:</p>
                  <select
                    name="teacherId"
                    value={scheduleData.teacherId}
                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn Giáo viên --</option>
                    {selectedTeacher && (
                      <option value={selectedTeacher.userId}>
                        {selectedTeacher.firstName} {selectedTeacher.middleName}{" "}
                        {selectedTeacher.lastName} - {selectedTeacher.majorId}
                      </option>
                    )}
                    {teachers.map((r) => (
                      <option key={r.userId} value={r.userId}>
                        {r.fullUserName} - {r.majorId}
                      </option>
                    ))}
                  </select>

                  <p className="text-left ml-[100px] text-xl ">Phòng:</p>
                  <select
                    required
                    name="roomId"
                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                    onChange={handleInputChange}
                    value={scheduleData.roomId}
                  >
                    <option value="">-- Chọn Phòng --</option>
                    {rooms.map((r) => (
                      <option key={r.roomId} value={r.roomId}>
                        {r.roomId} - {r.location}
                      </option>
                    ))}
                  </select>
                  <input
                    hidden
                    type="number"
                    name="slotNoInSubject"
                    value={scheduleData.slotNoInSubject || 0}
                    onChange={handleInputChange}
                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                  />

                  <div className="flex flex-wrap justify-center gap-4">
                    <button
                      type="submit"
                      className="w-full max-w-[200px] h-[50px] sm:h-[64px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg sm:text-2xl transition-all hover:scale-105 hover:bg-primaryBlue"
                    >
                      Thêm
                    </button>
                    <button
                      type="button" // Use type="button" to prevent form submission
                      className="w-full max-w-[200px] h-[50px] sm:h-[64px] border rounded-3xl bg-red-500 text-white font-bold text-lg sm:text-2xl transition-all hover:scale-105 hover:bg-red-700 mb-8"
                      onClick={handleCancel} // Hide form when cancel is clicked
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </>
    </>
  );
}

export default FormUpdateSchedule;
