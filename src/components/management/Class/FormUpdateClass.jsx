import { useEffect, useState } from "react";

function FormUpdateClass({ classToUpdate, onClassUpdated }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false); // Alert để thông báo thành công hay thất bại

    const [isFormVisible, setIsFormVisible] = useState(true); // State để điều khiển việc hiển thị form
    const handleCancel = () => {
        setIsFormVisible(false); // Ẩn form khi nhấn nút hủy
    };

    // Dữ liệu lớp học
    const [classData, setClassData] = useState(
        classToUpdate || {
            id: "",
            classId: "",
            subjectId: "",
            semesterId: "",
            status: 0,
            startDate: "",
            endDate: "",
        }
    );

    useEffect(() => {
        if (classToUpdate) {
            setClassData(classToUpdate);
        }
    }, [classToUpdate]);

    // Xử lý form Update
    const handleUpdateClass = async (e) => {
        e.preventDefault();
        try {
            // API cập nhật lớp học
            const response = await updateClass(classData);
            if (response.isSuccess) {
                setShowAlert("success");
                setSuccessMessage(response.message);
                onClassUpdated(response.classData); // Trả về dữ liệu mới nhất
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
                    className={`fixed top-5 right-0 z-50 ${showAlert === "error"
                        ? "animate-slide-in text-red-800 bg-red-50 border-red-300 mr-4"
                        : "animate-slide-in text-green-800 bg-green-50 border-green-300 mr-4"
                        } border rounded-lg p-4`}
                >
                    <div className="flex items-center">
                        <span>
                            {showAlert === "error" ? (
                                <strong>Lỗi:</strong>
                            ) : (
                                <strong>Thành Công:</strong>
                            )}
                        </span>{" "}
                        {showAlert === "error" ? errorMessage : successMessage}
                    </div>
                </div>
            )}
            {/* Thông báo End */}

            {isFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white border w-full max-w-[700px] h-auto rounded-2xl items-center text-center shadow-xl">
                        <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
                            Cập nhật lớp học
                        </p>
                        <form onSubmit={handleUpdateClass}>
                            {/* Mã số lớp học */}
                            <p className="text-left ml-[100px] text-xl mt-5">Mã số lớp học:</p>
                            <input
                                readOnly
                                type="text"
                                required
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                                value={classData.id}
                            />

                            {/* Tên lớp học */}
                            <p className="text-left ml-[100px] text-xl">Tên lớp học:</p>
                            <input
                                type="text"
                                required
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                                value={classData.classId}
                                onChange={(e) =>
                                    setClassData({ ...classData, classId: e.target.value })
                                }
                            />

                            {/* Mã môn */}
                            <p className="text-left ml-[100px] text-xl">Mã môn:</p>
                            <input
                                type="text"
                                required
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                                value={classData.subjectId}
                                onChange={(e) =>
                                    setClassData({ ...classData, subjectId: e.target.value })
                                }
                            />

                            {/* Mã kỳ học */}
                            <p className="text-left ml-[100px] text-xl">Mã kỳ học:</p>
                            <input
                                type="text"
                                required
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                                value={classData.semesterId}
                                onChange={(e) =>
                                    setClassData({ ...classData, semesterId: e.target.value })
                                }
                            />

                            {/* Trạng thái */}
                            <p className="text-left ml-[100px] text-xl">Trạng thái: </p>
                            <select
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                                value={classData.status}
                                onChange={(e) =>
                                    setClassData({ ...classData, status: Number(e.target.value) })
                                }
                            >
                                <option value={0}>Chưa bắt đầu</option>
                                <option value={1}>Đang diễn ra</option>
                                <option value={2}>Đã kết thúc</option>
                            </select>

                            {/* Ngày bắt đầu */}
                            <p className="text-left ml-[100px] text-xl">Ngày bắt đầu:</p>
                            <input
                                type="date"
                                required
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                                value={classData.startDate}
                                onChange={(e) =>
                                    setClassData({ ...classData, startDate: e.target.value })
                                }
                            />

                            {/* Ngày kết thúc */}
                            <p className="text-left ml-[100px] text-xl">Ngày kết thúc:</p>
                            <input
                                type="date"
                                required
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                                value={classData.endDate}
                                onChange={(e) =>
                                    setClassData({ ...classData, endDate: e.target.value })
                                }
                            />

                            <div className="flex flex-wrap justify-center gap-4 mt-4 mb-4">
                                <button
                                    type="submit"
                                    className="w-full max-w-[200px] h-[50px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg transition-all hover:scale-105 hover:bg-primaryBlue"
                                >
                                    Cập nhật
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

export default FormUpdateClass;
