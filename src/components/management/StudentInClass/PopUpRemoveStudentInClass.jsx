import { useState } from "react";

function PopUpRemoveStudentInClass({ onStudentRemove, student }) {
    const [isFormVisible, setIsFormVisible] = useState(true); // State để điều khiển việc hiển thị form
    const [alertType, setAlertType] = useState(null); // State để quản lý loại thông báo
    const [message, setMessage] = useState(""); // State để quản lý thông báo

    const handleCancel = () => {
        setIsFormVisible(false); // Ẩn form khi nhấn nút hủy
    };

    const handleDeleteClick = () => {
        try {
            // Lưu thông tin sinh viên cần xóa và gọi callback
            if (onStudentRemove) {
                onStudentRemove(student);
            }
            // Hiển thị thông báo thành công
            setAlertType("success");
            setMessage("Xóa sinh viên thành công.");
        } catch (error) {
            // Hiển thị lỗi nếu có vấn đề xảy ra
            setAlertType("error");
            setMessage("Đã xảy ra lỗi khi xóa sinh viên.");
        } finally {
            // Ẩn form
            setIsFormVisible(false);
        }
    };

    return (
        <>
            {isFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white border w-full max-w-[500px] h-[150px] rounded-2xl items-center text-center shadow-xl">
                        <p className="mt-8">Bạn có chắc muốn xóa sinh viên khỏi lớp?</p>
                        <div className="flex justify-center space-x-4 mt-4 mb-4">

                            <button
                                type="button"
                                className="w-full max-w-[150px] h-[50px] border rounded-3xl bg-red-500 text-white font-bold text-lg transition-all hover:scale-105 hover:bg-red-700"
                                onClick={handleDeleteClick}
                            >
                                Xóa
                            </button>
                            <button
                                type="button"
                                className="w-full max-w-[150px] h-[50px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg transition-all hover:scale-105 hover:bg-primaryBlue"
                                onClick={handleCancel}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hiển thị thông báo nếu có */}
            {alertType && (
                <div
                    className={`mt-4 text-lg ${alertType === "success" ? "text-green-500" : "text-red-500"
                        }`}
                >
                    {message}
                </div>
            )}
        </>
    );
}

export default PopUpRemoveStudentInClass;
