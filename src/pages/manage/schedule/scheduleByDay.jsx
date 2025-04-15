import { useState, useEffect } from "react";
import { getMajors } from "../../../services/majorService";
import { getSlots } from "../../../services/slotService";
import { getSchedule } from "../../../services/scheduleService";
import {
  getClassesIdByMajorId,
  GetClassSubjectById,
} from "../../../services/classService";
import { getRooms } from "../../../services/roomService";
import FormAddSchedule from "../../../components/management/Schedule/FormAddSchedule";
import FormUpdateSchedule from "../../../components/management/Schedule/FormUpdateSchedule";
import PopUpDeleteSchedule from "../../../components/management/Schedule/PopUpRemoveSchedule";
import FormAddAutoSchedule from "../../../components/management/Schedule/FormAddAutoSchedule";
import FormAddScheduleFill from "../../../components/management/Schedule/FormAddScheduleFill";

function ManageScheduleByDay() {
  //#region State & Error
  // Sử dụng filter theo ngày
  const [filterData, setFilterData] = useState({
    date: new Date().toISOString().split("T")[0], // "yyyy-mm-dd"
  });

  // Dữ liệu lấy từ API
  const [scheduleData, setScheduleData] = useState([]);
  const [majorData, setMajorData] = useState([]);
  const [slotData, setSlotData] = useState([]);
  const [roomData, setRoomData] = useState([]);
  const [classIdsData, setClassIdsData] = useState([]);
  const [classSubjectData, setClassSubjectData] = useState([]);

  const [dataToUpdate, setDataUpdate] = useState(null);

  // State để lưu ID của schedule cần xóa và hiển thị popup xóa
  const [deleteId, setDeleteId] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  // State điều khiển hiển thị form
  const [showAddAutoForm, setAddAutoForm] = useState(false);
  const toggleShowAutoForm = () => setAddAutoForm((prev) => !prev);

  const [showAddForm, setAddForm] = useState(false);
  const toggleShowForm = () => setAddForm((prev) => !prev);

  const [showAddFormFill, setAddFormFill] = useState(false);

  const [preFillData, setPreFillData] = useState(null);
  const openAddScheduleFormWithPrefill = (date, roomId, slotId) => {
    setPreFillData({ date, roomId, slotId });
    setAddFormFill((prev) => !prev);
  };

  const [showUpdateForm, setUpdateForm] = useState(false);
  const toggleShowUpdateForm = (data) => {
    setDataUpdate(data);
    setUpdateForm((prev) => !prev);
  };

 
  //#endregion

  //#region Fetch Data từ API
  // Lấy dữ liệu lịch học
  useEffect(() => {
    const fetchScheduleData = async () => {
      try {
        const majorRes = await getSchedule();
        setScheduleData(majorRes.result || []);
      } catch (err) {
        console.error("Error fetching majors:", err);
        setScheduleData([]);
      }
    };
    fetchScheduleData();
  }, []);

  // Hàm reload lại lịch học sau khi thêm/sửa/xóa
  const handleReload = async () => {
    const data = await getSchedule();
    setScheduleData(data.result || []);
  };

  // Lấy dữ liệu chuyên ngành
  useEffect(() => {
    const fetchMajorData = async () => {
      try {
        const majorRes = await getMajors();
        setMajorData(majorRes.result || []);
      } catch (err) {
        console.error("Error fetching majors:", err);
        setMajorData([]);
      }
    };
    fetchMajorData();
  }, []);

  // Lấy dữ liệu slot
  useEffect(() => {
    const fetchSlotData = async () => {
      try {
        const slotRes = await getSlots();
        const activeSlot = slotRes.result.filter((item) => item.status === 1);
        setSlotData(activeSlot || []);
      } catch (err) {
        console.error("Error fetching slots:", err);
        setSlotData([]);
      }
    };
    fetchSlotData();
  }, []);

  // Lấy dữ liệu phòng học
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomRes = await getRooms();
        const activeData = roomRes.result.filter((item) => item.status === 1);
        setRoomData(activeData || []);
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setRoomData([]);
      }
    };
    fetchRoomData();
  }, []);

  // Lấy dữ liệu ClassId theo chuyên ngành
  // useEffect(() => {
  //   const fetchClassIds = async () => {
  //     if (!filterData.majorId) {
  //       setClassIdsData([]);
  //       return;
  //     }
  //     try {
  //       const classIdsRes = await getClassesIdByMajorId(filterData.majorId);
  //       setClassIdsData(classIdsRes.result || []);
  //     } catch (err) {
  //       console.error("Error fetching class IDs:", err);
  //       setClassIdsData([]);
  //     }
  //   };
  //   fetchClassIds();
  // }, [filterData.majorId]);

  // Lấy dữ liệu ClassId theo chuyên ngành
  useEffect(() => {
    const fetchClassIds = async () => {
      if (!filterData.majorId) {
        setClassIdsData([]);
        return;
      }
      try {
        const classIdsRes = await getClassesIdByMajorId(filterData.majorId);
        setClassIdsData(classIdsRes.result || []);
      } catch (err) {
        console.error("Error fetching class IDs:", err);
        setClassIdsData([]);
      }
    };
    fetchClassIds();
  }, [filterData.majorId]);

  useEffect(() => {
    const fetchSubjects = async () => {
      // Lấy danh sách id duy nhất từ scheduleData
      const distinctIds = Array.from(
        new Set(scheduleData.map((s) => s.classSubjectId))
      );
      const newMap = { ...classSubjectData };
      for (const id of distinctIds) {
        // Nếu đã có trong subjectMap rồi thì bỏ qua
        if (newMap[id]) continue;
        try {
          // Gọi hàm GetClassSubjectById (đảm bảo hàm này trả về đối tượng có property chứa mã môn học,
          // ví dụ: result.subjectCode hoặc thuộc tính tương tự)
          const res = await GetClassSubjectById(id);
          if (res && res.result) {
            // Giả sử result trả về đối tượng với thuộc tính "subjectCode"
            newMap[id] =
              res.result.classId +
              "_" +
              res.result.subjectId +
              "_" +
              res.result.semesterId;
          }
        } catch (err) {
          console.error("Error fetching subject for id", id, err);
        }
      }
      setClassSubjectData(newMap);
    };

    if (scheduleData.length > 0) {
      fetchSubjects();
    }
  }, [scheduleData]);
  // Sau khi xóa thành công, cập nhật lại lịch học
  const handleDeleteSuccess = (id) => {
    setScheduleData((prev) => prev.filter((item) => item.scheduleId !== id));
    setShowDeletePopup(false);
  };

  // Khi bấm nút xóa, mở popup xác nhận
  const handleDeleteSchedule = (id) => {
    setDeleteId(id);
    setShowDeletePopup(true);
  };

  //#endregion

  //#region Format Date
  // Hàm format date theo kiểu dd/MM/yyyy HH:mm
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    // Nếu đối tượng Date không hợp lệ, trả về chuỗi rỗng
    if (isNaN(date.getTime())) return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year} `;
  };

  //#endregion

  //#region Xử lý Filter Input và Điều Hướng Ngày
  // Hàm thay đổi dữ liệu filter
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "date") {
      setFilterData((prev) => ({ ...prev, date: value }));
    } else {
      setFilterData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Khi chọn lớp từ dropdown
  // const handleClassChange = (e) => {
  //   setSelectedClassId(e.target.value);
  //   setFilterData((prev) => ({ ...prev, classId: e.target.value }));
  // };

  // // Khi chọn chuyên ngành từ dropdown
  // const handleMajorChange = (e) => {
  //   setSelectedMajorId(e.target.value);
  //   setFilterData((prev) => ({ ...prev, majorId: e.target.value }));
  // };

  // Điều hướng đến "Ngày trước"
  const handlePreviousDay = () => {
    setFilterData((prev) => {
      const prevDate = new Date(prev.date);
      prevDate.setDate(prevDate.getDate() - 1);
      return { ...prev, date: prevDate.toISOString().split("T")[0] };
    });
  };

  // Điều hướng đến "Ngày sau"
  const handleNextDay = () => {
    setFilterData((prev) => {
      const nextDate = new Date(prev.date);
      nextDate.setDate(nextDate.getDate() + 1);
      return { ...prev, date: nextDate.toISOString().split("T")[0] };
    });
  };
  //#endregion

  //#region Xử lý Dữ Liệu Lịch Học cho Ngày Đã Chọn
  // Lọc danh sách lịch học theo ngày được chọn (filterData.date)
  const schedulesForSelectedDay = scheduleData.filter((schedule) => {
    return schedule.date === filterData.date;
  });

  // Hàm lấy lịch học cho một phòng tại một slot trong ngày được chọn
  const getScheduleForRoomAndSlot = (roomId, slotId) => {
    return schedulesForSelectedDay.find(
      (s) => s.roomId === roomId && s.slotId === slotId
    );
  };

  // Render bảng thời khóa biểu dạng Manager View (trục dọc: phòng, trục ngang: slot)
  const renderManagerTable = () => {
    return (
      <table className="w-full mb-4  border-separate border-spacing-0 ">
        <thead>
          <tr>
            <th className="border-t border-l border-black rounded-tl-xl  p-2 bg-secondaryBlue text-white">
              Phòng học
            </th>
            {slotData.map((slot, index) => {
              let slotLabel;
              let extraClass = "";
              if (index + 1 > 4) {
                slotLabel === 5;
                extraClass = "border-r rounded-tr-xl";
              }
              return (
                <th
                  key={slot.slotId}
                  className={`border-t border-l border-black ${extraClass} p-2 bg-secondaryBlue text-white`}
                >
                  Slot {slot.slotId}
                  <br />
                  <span className="text-sm">
                    {slot.startTime.slice(0, 5)} - {slot.endTime.slice(0, 5)}
                  </span>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {roomData &&
            roomData.map((room, roomIndex) => {
              const isLastRow = roomIndex === roomData.length - 1;
              return (
                <tr key={room.roomId}>
                  <td
                    className={`border border-black p-2 font-bold ${
                      isLastRow ? "rounded-bl-xl" : ""
                    }`}
                  >
                    {room.roomId}
                  </td>
                  {slotData.map((slot, slotIndex) => {
                    const isLastCell = slotIndex === slotData.length - 1;
                    const extraClass =
                      isLastRow && isLastCell ? "rounded-br-xl" : "";
                    const schedule = getScheduleForRoomAndSlot(
                      room.roomId,
                      slot.slotId
                    );
                    return (
                      <td
                        key={`${room.roomId}-${slot.slotId}`}
                        className={`border border-black text-center p-1 ${extraClass}`}
                      >
                        {schedule ? (
                          <div className="p-1 border border-black w-[190px] h-auto m-auto rounded-2xl bg-whiteBlue scale-90">
                            <div>
                              <span className="ml-1 font-bold text-boldBlue">
                                {classSubjectData[schedule.classSubjectId]
                                  ? classSubjectData[schedule.classSubjectId]
                                  : schedule.classSubjectId}
                              </span>
                            </div>
                            <div>
                              Phòng học:
                              <span className="ml-1 ">
                                {schedule.roomId ? schedule.roomId : "Trống"}
                              </span>
                            </div>
                            <div>
                              Giáo viên:
                              <span className="ml-1 font-bold text-red-500">
                                {schedule.teacherId
                                  ? schedule.teacherId
                                  : "Trống"}
                              </span>
                            </div>
                            <div>
                              Tiết học số:
                              <span className="ml-1 font-bold text-red-500">
                                {schedule.slotNoInSubject}
                              </span>
                            </div>
                            <div className="flex">
                              <div className="flex m-auto">
                                <button
                                  type="button"
                                  className="border border-white w-[70px] h-[30px] bg-btnBlue text-white font-bold rounded-full transition-all duration-300 hover:scale-95"
                                  onClick={() => toggleShowUpdateForm(schedule)}
                                >
                                  <i
                                    className="fa fa-pencil-square w-13 h-21 text-black m-auto"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                              </div>
                              <div style={{ marginRight: "auto" }}>
                                <button
                                  type="button"
                                  className="border border-white w-[70px] h-[30px] bg-red-600 text-white font-bold rounded-full transition-all duration-300 hover:scale-95"
                                  onClick={() =>
                                    handleDeleteSchedule(schedule.scheduleId)
                                  }
                                >
                                  <i
                                    className="fa fa-trash w-13 h-21 text-black m-auto"
                                    aria-hidden="true"
                                  ></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="relative group">
                            <span className="text-green-500 font-bold group-hover:hidden">
                              Trống
                            </span>
                            <button
                              className="hidden group-hover:block absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[60px] h-[40px] bg-blue-500 hover:bg-blue-600 text-white text-xs rounded flex items-center justify-center"
                              onClick={() =>
                                openAddScheduleFormWithPrefill(
                                  filterData.date,
                                  room.roomId,
                                  slot.slotId
                                )
                              }
                            >
                              Thêm lịch
                            </button>
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    );
  };
  //#endregion

  //#region Render Giao Diện (UI)
  return (
    <>
     
      {/* Main Container */}
      {/* --- Filter --- */}
      <p className="ml-2">Sắp lịch học theo ngày:</p>
      <div className="flex w-auto h-12 ">
        <div className="flex">
          {/* Input chọn ngày */}
          <input
            type="date"
            name="date"
            value={filterData.date}
            onChange={handleInputChange}
            className="max-w-sm mx-auto ml-3 h-12 w-[230px] border border-black rounded-xl"
            required
          />
          {/* --- Điều hướng theo ngày --- */}
          <div className="flex mt-1 ml-4">
            <button
              onClick={handlePreviousDay}
              type="button"
              className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-auto mr-4 flex items-center justify-center"
            >
              Ngày trước
            </button>
            <div className="border-2 border-black rounded-xl w-[220px] h-[40px] bg-primaryGray flex items-center justify-center">
              {formatDateTime(filterData.date)}
            </div>
            <button
              onClick={handleNextDay}
              type="button"
              className="rounded-2xl transition-all duration-300 hover:bg-quaternarty hover:scale-95 border border-white w-[130px] h-[40px] bg-[#3c6470] text-white font-semibold ml-4 mr-auto flex items-center justify-center"
            >
              Ngày sau 
            </button>
          </div>
          {/* --- End Điều hướng --- */}
        </div>
        <div className="flex rounded-full transition-all duration-300 hover:scale-95 ml-auto mr-2">
          <button
            type="button"
            className="border border-white rounded-xl w-[200px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
            onClick={toggleShowAutoForm}
          >
            <i className="fa fa-plus mr-2" aria-hidden="true"></i>
            Thêm TKB Tự động
          </button>
        </div>
        <div className="flex rounded-full transition-all duration-300 hover:scale-95 mr-4">
          <button
            type="button"
            className="border border-white rounded-xl w-[130px] bg-secondaryGreen hover:bg-primaryGreen text-white font-semibold"
            onClick={toggleShowForm}
          >
            <i className="fa fa-plus mr-2" aria-hidden="true"></i>
            Thêm TKB
          </button>
        </div>
      </div>
      {/* --- End Filter --- */}

      {/* --- Bảng thời khóa biểu - Manager View --- */}
      <div className="ml-3 mr-3 mt-5 h-auto">
        <h2 className="text-2xl font-bold mb-4">
          Lịch học theo ngày{" "}
          <span className="text-red-600 text-3xl">
            {formatDateTime(filterData.date)}{" "}
          </span>
        </h2>
        {renderManagerTable()}
      </div>
      {/* --- End Bảng thời khóa biểu - Manager View --- */}
      {/* Ẩn & hiện form */}
      {showAddFormFill && (
        <FormAddScheduleFill onAdded={handleReload} initialData={preFillData} />
      )}

      {showAddForm && (
        <FormAddSchedule
          onAdded={handleReload}
        />
      )}
      {showAddAutoForm && (
        <FormAddAutoSchedule
          onAdded={handleReload}
        />
      )}
      {showUpdateForm && (
        <FormUpdateSchedule
          dataToUpdate={dataToUpdate}
          onAdded={handleReload}
        />
      )}
      {showDeletePopup && (
        <PopUpDeleteSchedule
          scheduleId={deleteId}
          onDeleted={handleDeleteSuccess}
          onCancel={() => setShowDeletePopup(false)}
        />
      )}
    </>
  );
}

export default ManageScheduleByDay;
