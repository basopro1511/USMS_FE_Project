import { useState } from "react";

function FormAddSubject({ onSubjectAdded }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);
    const [isFormVisible, setIsFormVisible] = useState(true);

    const [newSubject, setNewSubject] = useState({
        subjectId: "",
        subjectName: "",
        numberOfSlot: 0,
        majorId: "",
        description: "",
    });

    const handleCancel = () => {
        setIsFormVisible(false);
    };

    const handleAddSubject = async (e) => {
        e.preventDefault();
        try {
            // Simulate API call
            const response = { isSuccess: true, message: "Thêm môn học thành công!", subject: newSubject };
            if (response.isSuccess) {
                setShowAlert("success");
                setSuccessMessage(response.message);
                onSubjectAdded(response.subject);
                setTimeout(() => setShowAlert(false), 3000);
                setIsFormVisible(false);
            } else {
                setShowAlert("error");
                setErrorMessage(response.message);
                setTimeout(() => setShowAlert(false), 3000);
            }
        } catch (error) {
            console.error("Error adding subject:", error);
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
                                    <strong>Error:</strong> {errorMessage}
                                </span>
                            ) : (
                                <span>
                                    <strong>Success:</strong> {successMessage}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {isFormVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white border w-full max-w-[700px] h-auto rounded-2xl items-center text-center shadow-xl">
                        <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">Thêm môn học</h2>
                        <form onSubmit={handleAddSubject}>
                            <p htmlFor="subjectId" className="text-left ml-[100px] text-xl mt-5">Mã số môn học:</p>
                            <input
                                type="text"
                                id="subjectId"
                                name="subjectId"
                                placeholder="Nhập mã môn học"
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                required
                                onChange={(e) =>
                                    setNewSubject({ ...newSubject, subjectId: e.target.value })
                                }
                            />
                            <p htmlFor="subjectName" className="text-left ml-[100px] text-xl">Tên môn học:</p>
                            <input
                                type="text"
                                id="subjectName"
                                name="subjectName"
                                placeholder="Nhập tên môn học"
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                required
                                onChange={(e) =>
                                    setNewSubject({ ...newSubject, subjectName: e.target.value })
                                }
                            />

                            <p htmlFor="numberOfSlot" className="text-left ml-[100px] text-xl">Số buổi học:</p>
                            <input
                                type="number"
                                id="numberOfSlot"
                                name="numberOfSlot"
                                placeholder="Nhập số buổi học"
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                required
                                onChange={(e) =>
                                    setNewSubject({ ...newSubject, numberOfSlot: e.target.value })
                                }
                            />

                            <p htmlFor="majorId" className="text-left ml-[100px] text-xl">Chuyên ngành:</p>
                            <select
                                id="majorId"
                                name="majorId"
                                placeholder="Nhập chuyên ngành"
                                className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                required
                                onChange={(e) =>
                                    setNewSubject({ ...newSubject, majorId: e.target.value })
                                }
                            >
                                <option value="">Chọn chuyên ngành</option>
                                <option value="major1">Kỹ thuật phần mềm</option>
                                <option value="major2">Ngôn ngữ Anh</option>
                                <option value="major3">Quản trị kinh doanh</option>
                            </select>

                            <p htmlFor="description" className="text-left ml-[100px] text-xl">Mô tả:</p>
                            <textarea
                                id="description"
                                name="description"
                                placeholder="Nhập mô tả"
                                rows="4"
                                className="w-full max-w-[500px] h-[100px] text-black border border-black rounded-xl mb-3 px-4 py-1"
                                onChange={(e) =>
                                    setNewSubject({ ...newSubject, description: e.target.value })
                                }
                            ></textarea>

                            <div className="flex flex-wrap justify-center gap-4">
                                <button
                                    type="submit"
                                    className="w-full max-w-[200px] h-[50px] sm:h-[64px] border rounded-3xl bg-secondaryBlue text-white font-bold text-lg sm:text-2xl transition-all hover:scale-105 hover:bg-primaryBlue"
                                >
                                    Thêm
                                </button>
                                <button
                                    type="button" // Use type="button" to prevent form submission
                                    className="w-full max-w-[200px] h-[50px] sm:h-[64px] border rounded-3xl bg-red-500 text-white font-bold text-lg sm:text-2xl transition-all hover:scale-105 hover:bg-red-700 mb-8"
                                    onClick={handleCancel} // Hide form when cancel is clicked
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

export default FormAddSubject;
