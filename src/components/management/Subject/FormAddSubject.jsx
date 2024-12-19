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
                    <div className="p-4 rounded-md shadow-md bg-white max-w-md mx-auto">
                        <h2 className="text-xl font-semibold text-center text-secondaryBlue mb-4">Thêm môn học</h2>
                        <form onSubmit={handleAddSubject}>
                            <div className="mb-4">
                                <label htmlFor="subjectId" className="block font-medium mb-1">Mã số môn học</label>
                                <input
                                    type="text"
                                    id="subjectId"
                                    name="subjectId"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-secondaryBlue"
                                    required
                                    onChange={(e) =>
                                        setNewSubject({ ...newSubject, subjectId: e.target.value })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="subjectName" className="block font-medium mb-1">Tên môn học</label>
                                <input
                                    type="text"
                                    id="subjectName"
                                    name="subjectName"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-secondaryBlue"
                                    required
                                    onChange={(e) =>
                                        setNewSubject({ ...newSubject, subjectName: e.target.value })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="numberOfSlot" className="block font-medium mb-1">Số buổi học</label>
                                <input
                                    type="number"
                                    id="numberOfSlot"
                                    name="numberOfSlot"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-secondaryBlue"
                                    required
                                    onChange={(e) =>
                                        setNewSubject({ ...newSubject, numberOfSlot: e.target.value })
                                    }
                                />
                            </div>
                            <div className="mb-4">
                                <label htmlFor="majorId" className="block font-medium mb-1">Chuyên ngành</label>
                                <select
                                    id="majorId"
                                    name="majorId"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-secondaryBlue"
                                    required
                                    onChange={(e) =>
                                        setNewSubject({ ...newSubject, majorId: e.target.value })
                                    }
                                >
                                    <option value="">Chọn chuyên ngành</option>
                                    <option value="major1">Chuyên ngành 1</option>
                                    <option value="major2">Chuyên ngành 2</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="description" className="block font-medium mb-1">Mô tả</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring focus:ring-secondaryBlue"
                                    onChange={(e) =>
                                        setNewSubject({ ...newSubject, description: e.target.value })
                                    }
                                ></textarea>
                            </div>
                            <div className="flex justify-between">
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-secondaryBlue text-white font-medium rounded-md hover:bg-secondaryBlue-dark"
                                >
                                    Thêm
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2 bg-red-500 text-white font-medium rounded-md hover:bg-red-600"
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
