import { useState, useEffect, useRef } from "react";

function FormUpdateTeacher({ teacherToUpdate, onTeacherUpdated }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null); // Sử dụng useRef để tham chiếu đến input file

    const [teacherData, setTeacherData] = useState({
        teacherId: "",
        major: "",
        firstName: "",
        middleName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        createdAt: "",
        updatedAt: "",
        personalEmail:"",
        userAvatar:"",
    });

    useEffect(() => {
        if (teacherToUpdate) {
            setTeacherData(teacherToUpdate);
        }
    }, [teacherToUpdate]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file)); // Hiển thị ảnh xem trước
        }
    };

    const handleUpdateTeacher = async (e) => {
        e.preventDefault();
        try {
            const response = await updateTeacher(teacherData); // Giả sử đây là API gọi để cập nhật thông tin giáo viên
            if (response.isSuccess) {
                setShowAlert("success");
                setSuccessMessage(response.message);
                onTeacherUpdated(response.teacher);
                setTimeout(() => setShowAlert(false), 3000);
                setIsFormVisible(false);
            } else {
                setShowAlert("error");
                setErrorMessage(response.message);
                setTimeout(() => setShowAlert(false), 3000);
            }
        } catch (error) {
            console.error("Error updating teacher:", error);
        }
    };

    const handleCancel = () => {
        setIsFormVisible(false);
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
                    <div className="bg-white border w-full max-w-[900px] rounded-2xl items-center text-center shadow-xl">
                        <div>
                            <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
                                Cập Nhật Giáo Viên
                            </p>
                            <form onSubmit={handleUpdateTeacher} className="flex flex-col items-center gap-4 mt-8">
                                <div className="flex gap-8">
                                    <div>
                                        <div className="mb-4">
                                            <img
                                               src={selectedImage || teacherData.userAvatar}
                                                alt="Upload Preview"
                                                className="w-[180px] h-[220px] object-cover rounded-md"
                                            />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                ref={fileInputRef} // Sử dụng ref thay vì getElementById
                                            />
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current.click()}
                                                className="w-full bg-[#2B559B] text-white font-bold text-sm rounded-md mt-2 py-2"
                                            >
                                                Upload
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex gap-4">
                                            <div>
                                                <p className="text-left">Mã số Giáo Viên:</p>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                    value={teacherData.teacherId}
                                                    onChange={(e) =>
                                                        setTeacherData({ ...teacherData, teacherId: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <p className="text-left">Chuyên ngành:</p>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                    value={teacherData.major}
                                                    onChange={(e) =>
                                                        setTeacherData({ ...teacherData, major: e.target.value })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <div>
                                                <p className="text-left">Họ:</p>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                    value={teacherData.firstName}
                                                    onChange={(e) =>
                                                        setTeacherData({ ...teacherData, firstName: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <p className="text-left">Tên đệm:</p>
                                                <input
                                                    type="text"
                                                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                    value={teacherData.middleName}
                                                    onChange={(e) =>
                                                        setTeacherData({ ...teacherData, middleName: e.target.value })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <p className="text-left">Tên:</p>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                    value={teacherData.lastName}
                                                    onChange={(e) =>
                                                        setTeacherData({ ...teacherData, lastName: e.target.value })
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-left">Email:</p>
                                            <input
                                                type="email"
                                                required
                                                className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                value={teacherData.email}
                                                onChange={(e) =>
                                                    setTeacherData({ ...teacherData, email: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <p className="text-left">Email cá nhân:</p>
                                            <input
                                                type="email"
                                                required
                                                className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                value={teacherData.personalEmail}
                                                onChange={(e) =>
                                                    setTeacherData({ ...teacherData, personalEmail: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <p className="text-left">Số điện thoại:</p>
                                            <input
                                                type="text"
                                                required
                                                className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                value={teacherData.phoneNumber}
                                                onChange={(e) =>
                                                    setTeacherData({ ...teacherData, phoneNumber: e.target.value })
                                                }
                                            />
                                        </div>
                                        <div>
                                            <p className="text-left">Ngày sinh:</p>
                                            <input
                                                type="date"
                                                required
                                                className="w-full h-[40px] border border-gray-300 rounded-md px-3"
                                                value={teacherData.dateOfBirth}
                                                onChange={(e) =>
                                                    setTeacherData({ ...teacherData, dateOfBirth: e.target.value })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center gap-8 mt-8 mb-8">
                                    <button
                                        type="submit"
                                        className="w-[150px] h-[50px] bg-secondaryBlue text-white rounded-md font-bold"
                                    >
                                        Lưu
                                    </button>
                                    <button
                                        type="button"
                                        className="w-[150px] h-[50px] bg-red-500 text-white rounded-md font-bold"
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

export default FormUpdateTeacher;
