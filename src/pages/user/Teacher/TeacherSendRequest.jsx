import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function TeacherSendRequest() {
    const [requestType, setRequestType] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedTeacher, setSelectedTeacher] = useState("");
    const [teachingDate, setTeachingDate] = useState("");
    const [teachingTime, setTeachingTime] = useState("");
    const [changeTime, setChangeTime] = useState("");
    const [reason, setReason] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Danh sách giáo viên theo môn học
    const teacherOptions = {
        KTPM: ["Thầy Đa", "Thầy Hiếu", "Thầy Phúc"],
        XaHoi: ["Cô Lan", "Thầy Thanh"],
        NgonNgu: ["Cô Trúc", "Cô Isekai"],
    };

    // Hàm kiểm tra lỗi
    const validateForm = () => {
        const newErrors = {};

        // Kiểm tra loại yêu cầu
        if (!requestType || requestType === "0") {
            newErrors.requestType = "Vui lòng chọn loại yêu cầu hợp lệ.";
        }

        // Kiểm tra môn học
        if (!selectedSubject) {
            newErrors.selectedSubject = "Vui lòng chọn môn học.";
        }

        // Kiểm tra giáo viên (nếu loại đơn là "2")
        if (requestType === "2" && !selectedTeacher) {
            newErrors.selectedTeacher = "Vui lòng chọn giáo viên muốn đổi.";
        }

        // Kiểm tra ngày dạy
        if (!teachingDate) {
            newErrors.teachingDate = "Vui lòng chọn ngày dạy.";
        } else if (isNaN(new Date(teachingDate).getTime())) {
            newErrors.teachingDate = "Ngày dạy không hợp lệ.";
        }

        // Kiểm tra buổi dạy
        if (!teachingTime) {
            newErrors.teachingTime = "Vui lòng chọn buổi dạy.";
        }

        // Kiểm tra thời gian thay đổi
        if (!changeTime) {
            newErrors.changeTime = "Vui lòng nhập thời gian muốn thay đổi.";
        } else if (!/^(\d{1,2}:\d{2} (AM|PM)) - (\d{1,2}:\d{2} (AM|PM))$/.test(changeTime)) {
            newErrors.changeTime = "Thời gian không đúng định dạng (ví dụ: '10:00 AM - 12:00 PM').";
        }

        // Kiểm tra lý do
        if (!reason) {
            newErrors.reason = "Vui lòng nhập lý do.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0; // Form hợp lệ nếu không có lỗi
    };

    // Xử lí khi mà người dùng xuất hiện lỗi, người dùng ấn vào ô input thì lỗi tự động mất đi.
    // Cái này mình sẽ sử dụng ở dưới các ô input có nút onchange => trỏ tới hàm này để sử dụng.
    const handleInputChange = (field, value) => {
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            if (field === "requestType" && value !== "0") {
                delete newErrors.requestType;
            }
            if (field === "selectedSubject" && value) {
                delete newErrors.selectedSubject;
            }
            if (field === "selectedTeacher" && value) {
                delete newErrors.selectedTeacher;
            }
            if (field === "teachingDate" && value && !isNaN(new Date(value).getTime())) {
                delete newErrors.teachingDate;
            }
            if (field === "teachingTime" && value) {
                delete newErrors.teachingTime;
            }
            if (field === "changeTime" && /^(\d{1,2}:\d{2} (AM|PM)) - (\d{1,2}:\d{2} (AM|PM))$/.test(value)) {
                delete newErrors.changeTime;
            }
            if (field === "reason" && value) {
                delete newErrors.reason;
            }
            return newErrors;
        });
        switch (field) {
            case "requestType":
                setRequestType(value);
                break;
            case "selectedSubject":
                setSelectedSubject(value);
                break;
            case "selectedTeacher":
                setSelectedTeacher(value);
                break;
            case "teachingDate":
                setTeachingDate(value);
                break;
            case "teachingTime":
                setTeachingTime(value);
                break;
            case "changeTime":
                setChangeTime(value);
                break;
            case "reason":
                setReason(value);
                break;
            default:
                break;
        }
    };
    


    // Hàm xử lý gửi đơn
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Kiểm tra form hợp lệ
        if (!validateForm()) return;

        try {
            // Tạo dữ liệu gửi đi
            const requestData = {
                requestType,
                selectedSubject,
                selectedTeacher,
                teachingDate,
                teachingTime,
                changeTime,
                reason,
            };

            console.log("Dữ liệu gửi đi:", requestData);

            // Giả lập API bằng setTimeout
            setTimeout(() => {
                // Giả lập thành công
                alert("Gửi yêu cầu thành công!");
                navigate("/home"); // Điều hướng về trang chủ
            }, 1000); // Chờ 1 giây
        } catch (error) {
            console.error("Lỗi khi gửi yêu cầu:", error);
            alert("Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.");
        }
    };



    // Reset giáo viên khi thay đổi môn học
    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
        setSelectedTeacher(""); // Reset giáo viên khi thay đổi môn học
    };

    return (
        <div>
            {/* Tiêu đề */}
            <div className="flex justify-center">
                <p className="mt-8 text-3xl font-bold">Yêu cầu thay đổi lịch dạy</p>
            </div>

            {/* Bảng hiển thị */}
            <div className="mt-8 mb-8 mx-auto max-w-[700px] bg-gray-100 p-8 rounded shadow">
                {/* Loại yêu cầu */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="loai-yeu-cau">
                        Loại yêu cầu
                    </label>
                    <select
                        id="loai-yeu-cau"
                        value={requestType}
                        onChange={(e) => handleInputChange("requestType", e.target.value)}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${errors.requestType ? "border-red-500 focus:ring-red-500" : "border-black focus:ring-blue-500"
                            }`}
                    >
                        <option value="0">Chọn loại yêu cầu</option>
                        <option value="1">Đổi thời gian dạy sang buổi/ giờ khác</option>
                        <option value="2">Đổi người dạy thay thế</option>
                    </select>
                    {errors.requestType && <p className="text-red-500 text-sm">{errors.requestType}</p>}
                </div>
                {/* Môn học */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="mon-hoc">
                        Môn học
                    </label>
                    <select
                        id="mon-hoc"
                        value={selectedSubject}
                        onChange={(e) => handleInputChange("selectedSubject", e.target.value)}
                        className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        <option value="">Chọn môn học</option>
                        <option value="KTPM">PRM123</option>
                        <option value="XaHoi">EXE201</option>
                        <option value="NgonNgu">JPD123</option>
                    </select>
                    {errors.selectedSubject && <p className="text-red-500 text-sm">{errors.selectedSubject}</p>}
                </div>

                {/* Giáo viên muốn đổi (Hiển thị nếu loại yêu cầu là "Đổi người dạy thay thế") */}
                {requestType === "2" && (
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium mb-2" htmlFor="giao-vien-muon-doi">
                            Giáo viên muốn đổi
                        </label>
                        <select
                            id="giao-vien-muon-doi"
                            value={selectedTeacher}
                            onChange={(e) => handleInputChange("selectedTeacher", e.target.value)}
                            className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                        >
                            <option value="">Chọn giáo viên</option>
                            {teacherOptions[selectedSubject]?.map((teacher, index) => (
                                <option key={index} value={teacher}>
                                    {teacher}
                                </option>
                            ))}
                        </select>
                        {errors.selectedTeacher && <p className="text-red-500 text-sm">{errors.selectedTeacher}</p>}
                    </div>
                )}

                {/* Ngày dạy */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="ngay-day">
                        Ngày dạy
                    </label>
                    <input
                        type="date"
                        id="ngay-day"
                        value={teachingDate}
                        onChange={(e) => handleInputChange("teachingDate", e.target.value)}
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${errors.teachingDate ? "border-red-500 focus:ring-red-500" : "border-black focus:ring-blue-500"
                            }`}
                    />
                    {errors.teachingDate && <p className="text-red-500 text-sm">{errors.teachingDate}</p>}
                </div>


                {/* Buổi dạy */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="buoi-day">
                        Buổi dạy
                    </label>
                    <select
                        id="buoi-day"
                        value={teachingTime}
                        onChange={(e) => handleInputChange("teachingTime", e.target.value)}
                        className="w-full border border-black rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        <option value="">Chọn buổi</option>
                        <option value="sang">Sáng</option>
                        <option value="chieu">Chiều</option>
                        <option value="toi">Tối</option>
                    </select>
                    {errors.teachingTime && <p className="text-red-500 text-sm">{errors.teachingTime}</p>}
                </div>

                {/* Thời gian muốn thay đổi */}
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="thoi-gian-thay-doi">
                        Thời gian muốn thay đổi
                    </label>
                    <input
                        type="text"
                        id="thoi-gian-thay-doi"
                        value={changeTime}
                        onChange={(e) => handleInputChange("changeTime", e.target.value)}
                        placeholder="Nhập thời gian (ví dụ: 10:00 AM - 12:00 PM)"
                        className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring ${errors.changeTime ? "border-red-500 focus:ring-red-500" : "border-black focus:ring-blue-500"
                            }`}
                    />
                    {errors.changeTime && <p className="text-red-500 text-sm">{errors.changeTime}</p>}
                </div>
                {/* Lý do */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2" htmlFor="ly-do">
                        Lý do
                    </label>
                    <textarea
                        id="ly-do"
                        value={reason}
                        onChange={(e) => handleInputChange("reason", e.target.value)}
                        placeholder="Nhập lý do"
                        className="w-full h-32 border border-black rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-500"
                    ></textarea>
                    {errors.reason && <p className="text-red-500 text-sm">{errors.reason}</p>}
                </div>

                {/* Nút hành động */}
                <div className="flex justify-between">
                    <button
                        onClick={handleSubmit}
                        className="w-[300px] h-[64px] bg-secondaryBlue text-white rounded-md font-bold hover:scale-105 "
                    >
                        Gửi Đơn
                    </button>
                    <button
                        onClick={() => navigate("/home")}
                        className="w-[300px] h-[64px] bg-red-500 text-white rounded-md font-bold hover:scale-105"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    );
}

export default TeacherSendRequest;
