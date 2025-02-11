import { useState, useEffect, useRef } from "react";
import { UpdateStudent } from "../../../services/studentService";

function FormUpdateStudent({ studentToUpdate, onStudentUpdated }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null); // Quản lý ảnh đã chọn
    const fileInputRef = useRef(null);

    const [studentData, setStudentData] = useState(
        studentToUpdate || {
            userId: "",
            firstName: "",
            middleName: "",
            lastName: "",
            majorId: "",
            personalEmail: "",
            phoneNumber: "",
            dateOfBirth: "",
            term: "",
            userAvartar: "",
            status: "",
            address: "",
        }
    );

    useEffect(() => {
        if (studentToUpdate) {
            setStudentData(studentToUpdate);
        }
    }, [studentToUpdate]);

    const handleCancel = () => {
        setIsFormVisible(false);
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();

        try {
            const response = await UpdateStudent(studentData);
            if (response.isSuccess) {
                setSuccessMessage(response.message);
                setShowAlert("success");
                if (onStudentUpdated) {
                    onStudentUpdated(response.student);
                }
                setIsFormVisible(false);
                setTimeout(() => {
                    setShowAlert(false);
                    setIsFormVisible(false);
                }, 3000);
            } else {
                setErrorMessage(response.message);
                setShowAlert("error");
                setTimeout(() => setShowAlert(false), 3000);
            }
        } catch (error) {
            setErrorMessage("Đã xảy ra lỗi trong quá trình cập nhật.");
            setShowAlert("error");
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    const handleInputChange = (field, value) => {
        setStudentData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setSelectedImage(previewUrl);
            setStudentData((prev) => ({ ...prev, userAvartar: previewUrl }));
        }
    };

    const majorMapping = {
        "IT": "Information Technology",
        "BA": "Business Administration",
        "MT": "Media Technology",
    };

    const statusMapping = {
        "0": "Vô hiệu hóa",
        "1": "Đang học tiếp",
        "2": "Đang tạm hoãn",
        "3": "Đã tốt nghiệp",
    };

    return (
        <>
            {showAlert && (
                <div
                    className={`fixed top-5 right-0 z-50 ${showAlert === "error"
                        ? "animate-slide-in text-red-800 bg-red-50 border-red-300 mr-4"
                        : "animate-slide-in text-green-800 bg-green-50 border-green-300 mr-4"
                        } border rounded-lg p-4`}
                >
                    <div className="flex items-center">
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

            {isFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white border w-full max-w-[750px] h-auto rounded-2xl items-center shadow-xl p-6">
                        <div>
                            <p className="font-bold text-3xl sm:text-4xl md:text-5xl text-secondaryBlue text-center">
                                Cập nhật sinh viên
                            </p>
                            <form onSubmit={handleUpdateStudent}>
                                <div className="flex items-start gap-8 my-6">
                                    {/* Avatar Section */}
                                    <div className="mb-4">
                                        <img
                                            src={studentData.userAvartar|| selectedImage }
                                            alt="Upload Preview"
                                            className="w-[180px] h-[220px] object-cover rounded-md"
                                        />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            ref={fileInputRef}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current.click()}
                                            className="w-full bg-[#2B559B] text-white font-bold text-sm rounded-md mt-2 py-2"
                                        >
                                            Upload
                                        </button>
                                    </div>

                                    {/* Input Section */}
                                    <div className="flex-1 grid gap-4">
                                        {/* Student Name */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Họ:</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={studentData.lastName}
                                                    className="w-full border rounded-md px-3 py-2"
                                                    placeholder="Nhập họ"
                                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Tên đệm:</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={studentData.middleName}
                                                    className="w-full border rounded-md px-3 py-2"
                                                    placeholder="Nhập tên đệm"
                                                    onChange={(e) => handleInputChange("middleName", e.target.value)}
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">Tên:</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={studentData.firstName}
                                                    className="w-full border rounded-md px-3 py-2"
                                                    placeholder="Nhập tên"
                                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                                />
                                            </div>
                                        </div>

                                        {/* Major Fields */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Chuyên ngành:
                                            </label>
                                            <select
                                                value={studentData.majorId}
                                                className="w-full border rounded-md px-3 py-2"
                                                onChange={(e) => handleInputChange("majorId", e.target.value)}
                                            >
                                                {Object.entries(majorMapping).map(([key, value]) => (
                                                    <option key={key} value={key}>
                                                        {value}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>


                                        {/* Email */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Email cá nhân:</label>
                                            <input
                                                type="personalEmail"
                                                required
                                                value={studentData.personalEmail}
                                                className="w-full border rounded-md px-3 py-2"
                                                placeholder="Nhập email"
                                                onChange={(e) => handleInputChange("personalEmail", e.target.value)}
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Số điện thoại:</label>
                                            <input
                                                type="text"
                                                required
                                                value={studentData.phoneNumber}
                                                className="w-full border rounded-md px-3 py-2"
                                                placeholder="Nhập số điện thoại"
                                                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                            />
                                        </div>

                                        {/* Date of Birth */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Ngày sinh:</label>
                                            <input
                                                type="date"
                                                required
                                                value={studentData.dateOfBirth}
                                                className="w-full border rounded-md px-3 py-2"
                                                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                            />
                                        </div>

                                        {/* Term */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Kì học:</label>
                                            <select
                                                value={studentData.term}
                                                className="w-full border rounded-md px-3 py-2"
                                                onChange={(e) => handleInputChange("term", e.target.value)}
                                            >
                                                <option value="">Chọn kì học</option>
                                                {[...Array(9).keys()].map((num) => (
                                                    <option key={num + 1} value={num + 1}>
                                                        {num + 1}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Status */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Trạng thái:</label>
                                            <select
                                                value={studentData.status}
                                                className="w-full border rounded-md px-3 py-2"
                                                onChange={(e) => handleInputChange("status", e.target.value)}
                                            >
                                                {Object.entries(statusMapping).map(([key, value]) => (
                                                    <option key={key} value={key}>
                                                        {value}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* Address */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Địa chỉ:</label>
                                            <input
                                                type="text"
                                                required
                                                value={studentData.address}
                                                className="w-full border rounded-md px-3 py-2"
                                                placeholder="Nhập địa chỉ"
                                                onChange={(e) => handleInputChange("address", e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap justify-center gap-4">
                                    <button
                                        type="submit"
                                        className="w-full max-w-[200px] h-[50px] sm:h-[64px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg sm:text-2xl transition-all hover:scale-105 hover:bg-primaryBlue"
                                    >
                                        Cập nhật
                                    </button>
                                    <button
                                        type="button"
                                        className="w-full max-w-[200px] h-[50px] sm:h-[64px] border rounded-3xl bg-red-500 text-white font-bold text-lg sm:text-2xl transition-all hover:scale-105 hover:bg-red-700 mb-8"
                                        onClick={handleCancel}
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
    );
}

export default FormUpdateStudent;
