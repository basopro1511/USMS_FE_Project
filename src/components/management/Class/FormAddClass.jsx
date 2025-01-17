    import { useState } from "react";

    function FormAddClass({ onAddClass }) {
        const [formData, setFormData] = useState({
            id: "",
            classId: "",
            semesterId: "",
            subjectId: "",
            startDate: "",
            endDate: "",
        });
    
        const [isFormVisible, setIsFormVisible] = useState(true);
        const [alertType, setAlertType] = useState(null);
        const [message, setMessage] = useState("");
    
        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData({
                ...formData,
                [name]: value,
            });
        };
    
        const handleCancel = () => {
            setIsFormVisible(false);
        };
    
        const handleSubmit = (e) => {
            e.preventDefault();
            try {
                if (onAddClass) {
                    onAddClass(formData);
                }
                setAlertType("success");
                setMessage("Thêm lớp học thành công.");
            } catch (error) {
                setAlertType("error");
                setMessage("Đã xảy ra lỗi khi thêm lớp học.");
            } finally {
                setIsFormVisible(false);
            }
        };
    
        return (
            <>
                {isFormVisible && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white border w-full max-w-[700px] h-auto rounded-2xl items-center text-center shadow-xl">
                        <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
                            Thêm lớp học
                        </p>
                        <form onSubmit={handleSubmit}>
                            {/* Mã số lớp học */}
                            <p className="text-left ml-[100px] text-xl mt-5">Mã số lớp học:</p>
                            <input
                                type="text"
                                required
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                            />

                            {/* Tên lớp học */}
                            <p className="text-left ml-[100px] text-xl">Tên lớp học:</p>
                            <input
                                type="text"
                                required
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                              
                            />

                            {/* Mã môn */}
                            <p className="text-left ml-[100px] text-xl">Mã môn:</p>
                            <input
                                type="text"
                                required
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                               
                            />

                            {/* Mã kỳ học */}
                            <p className="text-left ml-[100px] text-xl">Mã kỳ học:</p>
                            <input
                                type="text"
                                required
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                               
                            />

                            {/* Ngày bắt đầu */}
                            <p className="text-left ml-[100px] text-xl">Ngày bắt đầu:</p>
                            <input
                                type="date"
                                required
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                                
                            />

                            {/* Ngày kết thúc */}
                            <p className="text-left ml-[100px] text-xl">Ngày kết thúc:</p>
                            <input
                                type="date"
                                required
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl px-4"
                                
                            />

                            <div className="flex flex-wrap justify-center gap-4 mt-4 mb-4">
                                <button
                                    type="submit"
                                    className="w-full max-w-[200px] h-[50px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg transition-all hover:scale-105 hover:bg-primaryBlue"
                                >
                                    Thêm
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
    
export default FormAddClass