import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
function FormDetailSubject({ subjectDetail }) {
    const [isFormVisible, setIsFormVisible] = useState(true); // State để điều khiển việc hiển thị form
    const [subjectData, setSubjectData] = useState({
        subjectId: "",
        subjectName: "",
        majorId: 0,
        numberOfSlot: "",
        description: "",
        status: 0,
    });

    useEffect(() => {
        if (subjectDetail) {
            setSubjectData(subjectDetail);
        }
    }, [subjectDetail]);
    // Đóng form
    const handleCancel = () => {
        console.log("123")
        setIsFormVisible(false); // Ẩn form khi nhấn nút hủy
    };
    return (
        <>
            {/* Thông báo Start */}
            {/* {showAlert && (
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
            )} */}
            {/* Thông báo  End*/}
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
                        <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
                            Chi tiết môn học
                        </p>
                        <form>
                            <p className="text-left ml-[100px] text-xl mt-5">Mã môn học:</p>
                            <input
                                readOnly
                                type="text"
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                value={subjectData.subjectId}
                            />
                            <p className="text-left ml-[100px] text-xl">Tên môn học:</p>
                            <input
                                readOnly
                                type="text"
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                value={subjectData.subjectName}
                            />
                            <p className="text-left ml-[100px] text-xl">Số buổi học:</p>
                            <input
                                readOnly
                                type="number"
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                value={subjectData.numberOfSlot}
                            />
                            <p className="text-left ml-[100px] text-xl">Chuyên ngành:</p>
                            <select
                                readOnly
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                value={subjectData.majorId}
                            >
                                <option value={0}>Kỹ thuật phần mềm</option>
                                <option value={1}>Ngôn ngữ   Anh</option>
                                <option value={2}>Quản trị kinh doanh</option>
                            </select>
                            <p className="text-left ml-[100px] text-xl">Trạng thái:</p>
                            <div className="flex m-auto w-full max-w-[500px] h-[80px] flex-wrap justify-center border border-black rounded-2xl gap-4">
                                <button
                                    type="button"
                                    className=" w-full max-w-[150px] h-[50px] sm:h-[45px] border rounded-2xl bg-gray-500 text-white font-bold text-lg sm:text-xl transition-all hover:scale-105 hover:bg-primaryBlue mt-auto mb-auto"
                                    onClick={() => handleChangeRoomStatus(roomData.roomId, 0)}
                                >
                                    Vô hiệu hóa
                                </button>
                                <button
                                    type="button"
                                    className=" w-full max-w-[150px] h-[50px] sm:h-[45px] border rounded-2xl bg-yellow-500 text-white font-bold text-lg sm:text-xl transition-all hover:scale-105 hover:bg-yellow-600 mt-auto mb-auto"
                                    onClick={() => handleChangeRoomStatus(roomData.roomId, 1)}
                                >
                                    Khả dụng
                                </button>
                                <button
                                    type="button"
                                    className=" w-full max-w-[150px] h-[50px] sm:h-[45px] border rounded-2xl bg-red-500 text-white font-bold text-lg sm:text-xl transition-all hover:scale-105 hover:bg-red-600 mt-auto mb-auto"
                                    onClick={() => handleChangeRoomStatus(roomData.roomId, 2)}
                                >
                                    Bảo trì
                                </button>
                            </div>
                            <p className="text-left ml-[100px] text-xl">Mô tả:</p>
                            <textarea
                                readOnly
                                className="w-full max-w-[500px] h-[100px] text-black border border-black rounded-xl mb-8 px-4 py-1"
                                value={subjectData.description}
                            ></textarea>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}

export default FormDetailSubject;
