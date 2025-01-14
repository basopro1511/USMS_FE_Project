import { useEffect, useState } from "react";
import { UpdateSubject } from "../../../services/subjectService";

function FormUpdateSubject({ subjectToUpdate, onSubjectUpdated }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false);

    const [isFormVisible, setIsFormVisible] = useState(true);
    const handleCancel = () => {
        setIsFormVisible(false);
    };

    const [subjectData, setSubjectData] = useState(
        subjectToUpdate || {
            subjectId: "",
            subjectName: "",
            majorId: 0,
            numberOfSlot: "",
            description: "",
            term: 0,
            status: 0, // 0: Inactive, 1: Active
            createAt: new Date().toISOString(),
            updateAt: new Date().toISOString(),
        }
    );

    const [availableStatuses] = useState([
        { id: 1, label: "Đang diễn ra" },
        { id: 2, label: "Chưa bắt đầu" },
        { id: 0, label: "Đã kết thúc" },
    ]);

    useEffect(() => {
        if (subjectToUpdate) {
            setSubjectData(subjectToUpdate);
        }
    }, [subjectToUpdate]);

    const handleUpdateSubject = async (e) => {
        e.preventDefault();
        try {
            // Gọi API cập nhật môn học (thay thế bằng hàm thực tế của bạn)
            const response = await UpdateSubject(subjectData);
            if (response.isSuccess) {
                setShowAlert("success");
                setSuccessMessage(response.message);
                onSubjectUpdated(response.subject);
                setTimeout(() => setShowAlert(false), 3000);
                setIsFormVisible(false);
            } else {
                setShowAlert("error");
                setErrorMessage(response.message);
                setTimeout(() => setShowAlert(false), 3000);
            }
        } catch (error) {
            setShowAlert("error");
            setErrorMessage("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
            setTimeout(() => setShowAlert(false), 3000);
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
                    <div className="bg-white border w-full max-w-[700px] h-auto rounded-2xl items-center text-center shadow-xl">
                        <div>
                            <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
                                Cập nhật môn học
                            </p>
                            <form onSubmit={handleUpdateSubject}>
                                <p className="text-left ml-[100px] text-xl mt-5">Mã môn học: </p>
                                <input
                                    readOnly
                                    type="text"
                                    required
                                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                    value={subjectData.subjectId}
                                    onChange={(e) =>
                                        setSubjectData({ ...subjectData, subjectId: e.target.value })
                                    }
                                />
                                <p className="text-left ml-[100px] text-xl ">Tên môn học: </p>
                                <input
                                    type="text"
                                    required
                                    placeholder="Tên môn học"
                                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                    value={subjectData.subjectName}
                                    onChange={(e) =>
                                        setSubjectData({ ...subjectData, subjectName: e.target.value })
                                    }
                                />
                                <p className="text-left ml-[100px] text-xl ">Chuyên ngành: </p>
                                <input
                                    type="text"
                                    required
                                    placeholder="Tên môn học"
                                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                    value={subjectData.majorId}
                                    onChange={(e) =>
                                        setSubjectData({ ...subjectData, majorId: e.target.value })
                                    }
                                />
                                <p className="text-left ml-[100px] text-xl ">Số buổi học: </p>
                                <input
                                    type="number"
                                    required
                                    placeholder="Số buổi học"
                                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                    value={subjectData.numberOfSlot}
                                    onChange={(e) =>
                                        setSubjectData({ ...subjectData, numberOfSlot: e.target.value })
                                    }
                                />
                                <p className="text-left ml-[100px] text-xl ">Kì học: </p>
                                <input
                                    type="text"
                                    required
                                    placeholder="Kỳ học"
                                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                    value={subjectData.term}
                                    onChange={(e) =>
                                        setSubjectData({ ...subjectData, term: e.target.value })
                                    }
                                />

                                <p className="text-left ml-[100px] text-xl ">Trạng thái: </p>
                                <select
                                    id="status"
                                    name="status"
                                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                    value={subjectData.status}
                                    onChange={(e) =>
                                        setSubjectData({ ...subjectData, status: parseInt(e.target.value, 10) })
                                    }
                                >
                                    {availableStatuses.map((status) => (
                                        <option key={status.id} value={status.id}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>


                                <p className="text-left ml-[100px] text-xl ">Mô tả: </p>
                                <textarea
                                    className="w-full max-w-[500px] h-[100px] text-black border border-black rounded-xl mb-3 px-4 py-1"
                                    placeholder="Mô tả môn học"
                                    value={subjectData.description}
                                    onChange={(e) =>
                                        setSubjectData({ ...subjectData, description: e.target.value })
                                    }
                                ></textarea>

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

export default FormUpdateSubject;