import React, { useState } from "react";
import { postSchedule } from "../../../services/scheduleService";

function AddScheduleForm({ onClose }) {
  // State lưu dữ liệu form
  const [formData, setFormData] = useState({
    classSubjectId: "",
    date: "",
    slotId: "",
    roomId: "",
    // Thêm các field khác nếu ClassScheduleDTO yêu cầu
  });

  // State thông báo
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Khi người dùng nhập / chọn field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Khi bấm nút "Thêm"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Gọi API thêm mới
    const response = await postSchedule(formData);
    if (response) {
      if (response.isSuccess) {
        setMessage(response.message || "Thêm thời khóa biểu thành công!");
        // Reset form
        setFormData({
          classSubjectId: "",
          date: "",
          slotId: "",
          roomId: "",
        });
      } else {
        setError(response.message || "Có lỗi xảy ra khi thêm TKB!");
      }
    } else {
      setError("Không thể kết nối tới máy chủ!");
    }
  };

  // Nút "Đóng" form
  const handleClose = () => {
    onClose(); // gọi hàm cha truyền xuống
  };

  return (
    <div className="p-4 mt-4 border border-gray-400 rounded bg-white">
      <h3 className="text-xl font-bold mb-2">Thêm Thời Khóa Biểu</h3>

      {message && <div className="text-green-600 mb-2">{message}</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ClassSubjectId */}
        <div>
          <label className="block font-medium">ClassSubjectId</label>
          <input
            type="number"
            name="classSubjectId"
            value={formData.classSubjectId}
            onChange={handleChange}
            className="border rounded p-1 w-full"
            placeholder="VD: 101"
            required
          />
        </div>

        {/* Date */}
        <div>
          <label className="block font-medium">Ngày học</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="border rounded p-1 w-full"
            required
          />
        </div>

        {/* SlotId */}
        <div>
          <label className="block font-medium">Slot</label>
          <input
            type="number"
            name="slotId"
            value={formData.slotId}
            onChange={handleChange}
            className="border rounded p-1 w-full"
            placeholder="VD: 1"
            required
          />
        </div>

        {/* RoomId */}
        <div>
          <label className="block font-medium">Phòng học</label>
          <input
            type="text"
            name="roomId"
            value={formData.roomId}
            onChange={handleChange}
            className="border rounded p-1 w-full"
            placeholder="VD: D203"
            required
          />
        </div>

        {/* Nút thêm */}
        <button
          type="submit"
          className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
        >
          Thêm
        </button>

        {/* Nút đóng */}
        <button
          type="button"
          onClick={handleClose}
          className="ml-2 bg-gray-300 py-1 px-4 rounded hover:bg-gray-400"
        >
          Đóng
        </button>
      </form>
    </div>
  );
}

export default AddScheduleForm;
