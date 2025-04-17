/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { changeSubjectStatus } from "../../../services/subjectService";

function FormDetailSubject({ subjectDetail, onSubjectDetailUpdated }) {
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false); // Điều khiển hiển thị thông báo
    const [isFormVisible, setIsFormVisible] = useState(true); // State để điều khiển việc hiển thị form
    const [subjectData, setSubjectData] = useState({
        subjectId: "",
        subjectName: "",
        majorId: 0,
        numberOfSlot: "",
        description: "",
        status: 0,
        createAt: new Date().toISOString(),
        UpdateAt: new Date().toISOString(),
    });

    const handleChangeSubjectStatus = async (subjectId, status) => {
        try {
            const response = await changeSubjectStatus(subjectId, status); // Gọi API
            if (response.isSuccess) {
                setShowAlert(true); // Hiển thị thông báo
                setSuccessMessage(response.message); // Lưu thông báo thành công
                setTimeout(() => setShowAlert(false), 3000); // Ẩn thông báo sau 3 giây
                onSubjectDetailUpdated(response.subject); // Cập nhật dữ liệu
                setIsFormVisible(false); // Ẩn form
            } else {
                setShowAlert(true); // Hiển thị thông báo
                setErrorMessage(response.message); // Lưu thông báo lỗi
                setTimeout(() => setShowAlert(false), 3000); // Ẩn thông báo sau 3 giây
            }
        } catch (error) {
            console.error("Error updating subject:", error);
        }
    };


    useEffect(() => {
        if (subjectDetail) {
            setSubjectData(subjectDetail);
        }
    }, [subjectDetail]);

    const handleCancel = () => {
        setIsFormVisible(false); // Ẩn form khi nhấn nút hủy
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
            {isFormVisible && ( // Chỉ hiển thị form nếu isFormVisible là true
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white border w-full max-w-[700px] h-auto rounded-2xl items-center text-center shadow-xl">
                        <div className="flex ">
                            <button
                                type="button" // Sử dụng type="button" để ngừng việc submit form
                                className="w-full max-w-[80px] h-[30px] sm:h-[40px] border rounded-xl bg-red-500 text-white font-bold text-lg sm:text-2xl transition-all hover:scale-105 hover:bg-red-700 ml-auto mr-3 mt-3"
                                onClick={handleCancel} // Ẩn form khi nhấn nút
                            >
                                X
                            </button>
                        </div>
                        <p className="font-bold text-3xl sm:text-4xl md:text-5xl text-secondaryBlue">
                            Chi tiết môn học
                        </p>
                        <form>
                            <p className="text-left ml-[100px] text-xl mt-5">Mã môn học:</p>
                            <div className="flex m-auto w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4 flex items-center">
                                {subjectData.subjectId}
                            </div>
                            <p className="text-left ml-[100px] text-xl">Tên môn học:</p>
                            <div className="flex m-auto w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4 flex items-center">
                                {subjectData.subjectName}
                            </div>
                            <p className="text-left ml-[100px] text-xl">Chuyên ngành:</p>
                            <div className="flex m-auto w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4 flex items-center">
                                {subjectData.majorId}
                            </div>
                            <p className="text-left ml-[100px] text-xl">Số buổi học:</p>
                            <div className="flex m-auto w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4 flex items-center">
                                {subjectData.numberOfSlot}
                            </div>
                            <p className="text-left ml-[100px] text-xl">Kì học:</p>
                            <div className="flex m-auto w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4 flex items-center">
                                {subjectData.term}
                            </div>
                            <p className="text-left ml-[100px] text-xl mt-3">
                                Trạng thái hiện tại:{" "}
                            </p>
                            <input
                                type="text"
                                required
                                readOnly
                                placeholder="Nhập vị trí"
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl  px-4 text-xl"
                                value={
                                    subjectData.status === 0
                                        ? "Chưa bắt đầu"
                                        : subjectData.status === 1
                                            ? "Đang diễn ra"
                                            : subjectData.status === 2
                                                ? "Đã kết thúc"
                                                : ""
                                }
                            />
                            <p className="text-left ml-[100px] text-xl">Thay đổi trạng thái:</p>
                            <div className="flex m-auto w-full max-w-[500px] h-[80px] flex-wrap justify-center border border-black rounded-2xl gap-4">
                                <button
                                    type="button"
                                    className="w-full max-w-[150px] h-[50px] sm:h-[45px] border rounded-2xl bg-gray-500 text-white font-bold text-lg sm:text-xl transition-all hover:scale-105 hover:bg-primaryBlue mt-auto mb-auto"
                                    onClick={() => handleChangeSubjectStatus(subjectData.subjectId, 0 )}
                                >
                                    Vô hiệu hóa 
                                </button>
                                <button
                                    type="button"
                                    className="w-full max-w-[150px] h-[50px] sm:h-[45px] border rounded-2xl bg-yellow-500 text-white font-bold text-lg sm:text-xl transition-all hover:scale-105 hover:bg-yellow-600 mt-auto mb-auto"
                                    onClick={() => handleChangeSubjectStatus(subjectData.subjectId, 1)}
                                >
                                   Đang diễn ra
                                </button>
                                <button
                                    type="button"
                                    className="w-full max-w-[150px] h-[50px] sm:h-[45px] border rounded-2xl bg-red-500 text-white font-bold text-lg sm:text-xl transition-all hover:scale-105 hover:bg-red-600 mt-auto mb-auto"
                                    onClick={() => handleChangeSubjectStatus(subjectData.subjectId, 2)}
                                >
                                    Đang tạm hoãn
                                </button>
                            </div>
                            <p className="text-left ml-[100px] text-xl">Mô tả:</p>
                            <div className="flex m-auto w-full max-w-[500px] h-[100px] text-black border border-black rounded-xl mb-8 px-4 py-1 flex">
                                {subjectData.description}
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default FormDetailSubject;
