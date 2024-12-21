import { useState } from "react";

function FormUpdateStudent({ studentToUpdate, onStudentUpdated }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [updatedStudent, setUpdatedStudent] = useState({ ...studentToUpdate });
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [avatar, setAvatar] = useState(onStudentUpdated.avatar || null);

    const handleCancel = () => {
        setIsFormVisible(false);
    };

    const majorMapping = {
        "0": "Khoa học máy tính",
        "1": "Công nghệ phần mềm",
        "2": "Kỹ thuật mạng",
    };

    const handleUpdateStudent = async (e) => {
        e.preventDefault();
        try {
            // Mô phỏng gọi API
            const response = await fakeUpdateSubjectAPI(updatedStudent);
            if (response.isSuccess) {
                setShowAlert("success");
                setSuccessMessage(response.message);
                if (onStudentUpdated) {
                    onStudentUpdated(response.student); // Cập nhật dữ liệu cha
                }
                // Đóng form sau 3 giây hoặc ngay lập tức
                setTimeout(() => {
                    setShowAlert(false);
                    setIsFormVisible(false); // Đóng form
                }, 3000);
            } else {
                setShowAlert("error");
                setErrorMessage(response.message);
                setTimeout(() => setShowAlert(false), 3000);
            }
        } catch (error) {
            console.error("Error updating student:", error);
            setShowAlert("error");
            setErrorMessage("Có lỗi xảy ra khi cập nhật.");
            setTimeout(() => setShowAlert(false), 3000);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setAvatar(reader.result);
            reader.readAsDataURL(file);
        }
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
                                    <div className="relative">
                                        <img
                                            src={avatar || "https://via.placeholder.com/150"}
                                            alt="Avatar"
                                            className="w-180 h-220 object-cover border"
                                        />
                                        <label
                                            htmlFor="avatar"
                                            className="block mt-2 text-center text-blue-500 cursor-pointer"
                                        >
                                            Upload
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            id="avatar"
                                            className="hidden"
                                            onChange={handleAvatarChange}
                                        />
                                    </div>

                                    {/* Input Section */}
                                    <div className="flex-1 grid gap-4">
                                        {/* First Row: Student ID and Major */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Mã số sinh viên:
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={updatedStudent.studentId}
                                                    className="w-full border rounded-md px-3 py-2"
                                                    placeholder="Nhập mã số sinh viên"
                                                    onChange={(e) =>
                                                        setUpdatedStudent({
                                                            ...updatedStudent,
                                                            studentId: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Chuyên ngành:
                                                </label>
                                                <select
                                                    required
                                                    value={updatedStudent.majorId || ""}
                                                    className="w-full border rounded-md px-3 py-2"
                                                    onChange={(e) =>
                                                        setUpdatedStudent({
                                                            ...updatedStudent,
                                                            majorId: e.target.value,
                                                        })
                                                    }
                                                >
                                                    {Object.entries(majorMapping).map(([key, value]) => (
                                                        <option key={key} value={key}>
                                                            {value}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Second Row: Name Fields */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Họ:
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={updatedStudent.lastName}
                                                    className="w-full border rounded-md px-3 py-2"
                                                    placeholder="Nhập họ"
                                                    onChange={(e) =>
                                                        setUpdatedStudent({
                                                            ...updatedStudent,
                                                            lastName: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Tên đệm:
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={updatedStudent.middleName}
                                                    className="w-full border rounded-md px-3 py-2"
                                                    placeholder="Nhập tên đệm"
                                                    onChange={(e) =>
                                                        setUpdatedStudent({
                                                            ...updatedStudent,
                                                            middleName: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-1">
                                                    Tên:
                                                </label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={updatedStudent.firstName}
                                                    className="w-full border rounded-md px-3 py-2"
                                                    placeholder="Nhập tên"
                                                    onChange={(e) =>
                                                        setUpdatedStudent({
                                                            ...updatedStudent,
                                                            firstName: e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>

                                        {/* Third Row: Email */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Gmail:
                                            </label>
                                            <input
                                                type="email"
                                                required
                                                value={updatedStudent.email}
                                                className="w-full border rounded-md px-3 py-2"
                                                placeholder="Nhập email"
                                                onChange={(e) =>
                                                    setUpdatedStudent({
                                                        ...updatedStudent,
                                                        email: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        {/* Fourth Row: Phone Number */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Số điện thoại:
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={updatedStudent.phone}
                                                className="w-full border rounded-md px-3 py-2"
                                                placeholder="Nhập số điện thoại"
                                                onChange={(e) =>
                                                    setUpdatedStudent({
                                                        ...updatedStudent,
                                                        phone: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        {/* Fifth Row: Date of Birth */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Ngày sinh:
                                            </label>
                                            <input
                                                type="date"
                                                required
                                                value={updatedStudent.dateOfBirth}
                                                className="w-full border rounded-md px-3 py-2"
                                                onChange={(e) =>
                                                    setUpdatedStudent({
                                                        ...updatedStudent,
                                                        dateOfBirth: e.target.value,
                                                    })
                                                }
                                            />
                                        </div>

                                        {/* Sixth Row: Semester */}
                                        <div>
                                            <label className="block text-sm font-medium mb-1">
                                                Kì học:
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={updatedStudent.startYear || ""}
                                                className="w-full border rounded-md px-3 py-2"
                                                placeholder="Nhập kì học"
                                                onChange={(e) =>
                                                    setUpdatedStudent({
                                                        ...updatedStudent,
                                                        startYear: e.target.value,
                                                    })
                                                }
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
