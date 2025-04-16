/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import {
  getClassesIdByClassId,
  getClassesIdByMajorId,
} from "../../../services/classService";
import { GetAvailableRoom } from "../../../services/roomService";
import {
  AddSchedule,
  getAvailableTeachersForAddSchedule,
} from "../../../services/scheduleService";
import { getMajors } from "../../../services/majorService";

// eslint-disable-next-line react/prop-types
function FormAddScheduleFillByWeek({ onAdded, initialData }) {
  //#region State & Error
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false); // Alert for success or failure notification
  const [isFormVisible, setIsFormVisible] = useState(true); // State to control form visibility

  // Dữ liệu cho form
  const [classSubjectIds, setClassSubjectIds] = useState([]); // dropdown Lớp-Môn
  const [classSubjects, setClassSubjects] = useState([]); // dropdown Lớp-Môn
  const [rooms, setRooms] = useState([]); // dropdown phòng (nếu fetch)
  const [teachers, setTeachers] = useState([]);
  // Dữ liệu schedule
  const [newSchedule, setNewSchedule] = useState({
    classSubjectId: 0,
    date: initialData?.date || "",
    slotId: initialData?.slotId || 0,
    roomId: initialData?.roomId || "",
    slotNoInSubject: 0,
    teacherId: "",
  });

  // Nếu form mở lại với dữ liệu mới, cập nhật state:
  useEffect(() => {
    if (initialData) {
      setNewSchedule((prev) => ({
        ...prev,
        date: initialData.date,
        roomId: initialData.roomId,
        slotId: initialData.slotId,
      }));
    }
  }, [initialData]);
  const [majorIdSelected, setSelectedMajorId] = useState("");
  const [classSubjectIdSelected, setClassSubjectIdSelected] = useState("");

  //#endregion

  //#region Fetch API

  const handleCancel = () => {
    setIsFormVisible(false); // Hide form when cancel is clicked
  };
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

  //#region  lấy danh sách lớp học bởi chuyên ngành
  useEffect(() => {
    if (majorIdSelected) {
      const fetchClassSubjectIds = async () => {
        const classSubjects = await getClassesIdByMajorId(majorIdSelected);
        setClassSubjectIds(classSubjects.result);
      };
      fetchClassSubjectIds();
    }
  }, [majorIdSelected]);
  //#endregion

  //#region  lấy danh sách lớp
  useEffect(() => {
    if (classSubjectIdSelected) {
      const fetchClassSubject = async () => {
        const classSubjects = await getClassesIdByClassId(
          classSubjectIdSelected
        ); //Lấy ra list  trong database
        setClassSubjects(classSubjects.result);
      };
      fetchClassSubject();
    }
  }, [classSubjectIdSelected]);
  //#endregion

  //#region  lấy danh sách giáo viên
  useEffect(() => {
    if (majorIdSelected && newSchedule.date && newSchedule.slotId) {
      const fetchAvailableTeachers = async () => {
        try {
          const response = await getAvailableTeachersForAddSchedule(
            majorIdSelected,
            newSchedule.date,
            newSchedule.slotId
          );
          setTeachers(response.result);
        } catch (error) {
          console.error("Error fetching available teachers:", error);
        }
      };
      fetchAvailableTeachers();
    }
  }, [majorIdSelected, newSchedule.date, newSchedule.slotId]);

  //#endregion

  //#region lấy danh sách phòng khả dụng
  useEffect(() => {
    if (newSchedule.date && newSchedule.slotId) {
      const fetchAvailableRooms = async () => {
        try {
          const rooms = await GetAvailableRoom(
            newSchedule.date,
            newSchedule.slotId
          );
          const available = rooms.result.filter((item) => item.status === 1);
          setRooms(available);
        } catch (error) {
          console.error("Error fetching subjects:", error);
        }
      };
      fetchAvailableRooms();
    }
  }, [newSchedule.date, newSchedule.slotId]);

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

  //#region Xử lý Submit Form để thêm lịch học
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const response = await AddSchedule(newSchedule);
      if (response && response.isSuccess) {
        setSuccessMessage(response.message);
        setShowAlert("success");
        setTimeout(() => {
          setShowAlert(false); // Ẩn thông báo sau 3 giây
        }, 6000);
        onAdded(response.data);
        setIsFormVisible(false); // Ẩn form sau khi thông báo biến mất
      } else {
        setErrorMessage(response.message);
        setShowAlert("error");
        setTimeout(() => {
          setShowAlert(false); // Ẩn thông báo sau 3 giây
        }, 4000);
      }
    } catch (error) {
      setErrorMessage("Lỗi hệ thống, vui lòng thử lại!");
      setShowAlert("error");
      console.error("Error adding schedule:", error);
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
                  Thêm lịch học
                </p>
                <form onSubmit={handleSubmit}>
                  <p className="text-left ml-[100px] text-xl mt-5">
                    Mã lớp - Môn học:
                  </p>
                  <select
                    name="majorId"
                    onChange={(e) => setSelectedMajorId(e.target.value)}
                    required
                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                  >
                    <option value="" disabled selected>
                      Chọn chuyên ngành
                    </option>
                    {majorData.map((major) => (
                      <option key={major.majorId} value={major.majorId}>
                        {major.majorName}
                      </option>
                    ))}
                  </select>
                  <p className="text-left ml-[100px] text-xl mt-5">Mã lớp :</p>
                  <select
                    placeholder="Mã kỳ học"
                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                    name=""
                    onChange={(e) => setClassSubjectIdSelected(e.target.value)}
                  >
                    <option value="">-- Chọn Lớp --</option>
                    {classSubjectIds.map((cs) => (
                      <option key={cs} value={cs}>
                        {cs}
                      </option>
                    ))}
                  </select>
                  <p className="text-left ml-[100px] text-xl ">Môn học :</p>
                  <select
                    type="text"
                    required
                    placeholder="Mã kỳ học"
                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                    name="classSubjectId"
                    value={newSchedule.classSubjectId}
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn Lớp-Môn --</option>
                    {classSubjects.map((cs) => (
                      <option key={cs.classSubjectId} value={cs.classSubjectId}>
                        {cs.classId}_{cs.subjectId}_{cs.semesterId}
                      </option>
                    ))}
                  </select>
                  <p className="text-left ml-[100px] text-xl ">Giáo viên:</p>
                  <select
                    required
                    name="teacherId"
                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                    onChange={handleInputChange}
                  >
                    <option value="">-- Chọn Giáo viên --</option>
                    {teachers.map((r) => (
                      <option key={r.userId} value={r.userId}>
                        {r.fullUserName} - {r.majorId}
                      </option>
                    ))}
                  </select>{" "}
                  <p className="text-left ml-[100px] text-xl ">Slot:</p>
                  <select
                    required
                    name="slotId"
                    value={newSchedule.slotId}
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
           
                  <p className="text-left ml-[100px] text-xl ">Ngày:</p>
                  <input
                    type="date"
                    required
                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                    name="date"
                    value={newSchedule.date}
                    onChange={handleInputChange}
                  />
                  <p className="text-left ml-[100px] text-xl ">Phòng:</p>
                  <input
                    required
                    name="roomId"
                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                    onChange={handleInputChange}
                    value={newSchedule.roomId}
                  ></input>
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

export default FormAddScheduleFillByWeek;
