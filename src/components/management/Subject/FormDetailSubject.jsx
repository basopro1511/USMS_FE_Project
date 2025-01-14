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
                onSubjectDetailUpdated(response.subject); // Cập nhật dữ liệu
                setTimeout(() => setShowAlert(false), 3000); // Ẩn thông báo sau 3 giây
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
                            <p className="text-left ml-[100px] text-xl">Trạng thái:</p>
                            <div className="flex m-auto w-full max-w-[500px] h-[80px] flex-wrap justify-center border border-black rounded-2xl gap-4">
                                <button
                                    type="button"
                                    className="w-full max-w-[150px] h-[50px] sm:h-[45px] border rounded-2xl bg-gray-500 text-white font-bold text-lg sm:text-xl transition-all hover:scale-105 hover:bg-primaryBlue mt-auto mb-auto"
                                    onClick={() => handleChangeSubjectStatus(subjectData.subjectId, 2)}
                                >
                                    Chưa bắt đầu
                                </button>
                                <button
                                    type="button"
                                    className="w-full max-w-[150px] h-[50px] sm:h-[45px] border rounded-2xl bg-yellow-500 text-white font-bold text-lg sm:text-xl transition-all hover:scale-105 hover:bg-yellow-600 mt-auto mb-auto"
                                    onClick={() => handleChangeSubjectStatus(subjectData.subjectId, 0)}
                                >
                                    Đã kết thúc
                                </button>
                                <button
                                    type="button"
                                    className="w-full max-w-[150px] h-[50px] sm:h-[45px] border rounded-2xl bg-red-500 text-white font-bold text-lg sm:text-xl transition-all hover:scale-105 hover:bg-red-600 mt-auto mb-auto"
                                    onClick={() => handleChangeSubjectStatus(subjectData.subjectId, 1)}
                                >
                                    Đang diễn ra
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
