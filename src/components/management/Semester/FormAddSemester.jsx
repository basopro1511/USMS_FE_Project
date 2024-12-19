import { useState } from "react";
// import { AddSemester } from "../../../services/semesterService"; // Update to match your service

// eslint-disable-next-line react/prop-types
function FormAddSemester({ onSemesterAdded }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false); // Alert for success or failure notification
    const [newSemester, setNewSemester] = useState({
        semesterId: "",
        semesterName: "",
        startDate: "",
        endDate: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    });

    const [isFormVisible, setIsFormVisible] = useState(true); // State to control form visibility
    const handleCancel = () => {
        setIsFormVisible(false); // Hide form when cancel is clicked
    };

    // Handle form AddSemester
    const handleAddSemester = async (e) => {
        e.preventDefault();
        try {
            const response = await AddSemester(newSemester);
            if (response.isSuccess) {
                setShowAlert("success");
                setSuccessMessage(response.message);
                onSemesterAdded(response.semester);
                setTimeout(() => setShowAlert(false), 3000);
                setIsFormVisible(false); // Hide the form after success
            } else {
                setShowAlert("error");
                setErrorMessage(response.message);
                setTimeout(() => setShowAlert(false), 3000);
            }
        } catch (error) {
            console.error("Error adding semester:", error);
        }
    };

    return (
        <>
            {/* Notification Start */}
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
            {/* Notification End */}

            {isFormVisible && ( // Show form if isFormVisible is true
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white border w-full max-w-[700px] h-auto rounded-2xl items-center text-center shadow-xl">
                        <div>
                            <p className="font-bold text-3xl sm:text-4xl md:text-5xl mt-8 text-secondaryBlue">
                                Thêm kỳ học
                            </p>
                            <form onSubmit={handleAddSemester}>
                                <p className="text-left ml-[100px] text-xl mt-5">Mã kì học:</p>
                                <input
                                    type="text"
                                    required
                                    placeholder="Mã kì học"
                                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                    onChange={(e) =>
                                        setNewSemester({ ...newSemester, semesterId: e.target.value })
                                    }
                                />
                                <p className="text-left ml-[100px] text-xl ">Tên kì học:</p>
                                <input
                                    type="text"
                                    required
                                    placeholder="Tên kì học"
                                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                    onChange={(e) =>
                                        setNewSemester({ ...newSemester, semesterName: e.target.value })
                                    }
                                />
                                <p className="text-left ml-[100px] text-xl ">Ngày bắt đầu:</p>
                                <input
                                    type="date"
                                    required
                                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                    onChange={(e) =>
                                        setNewSemester({ ...newSemester, startDate: e.target.value })
                                    }
                                />
                                <p className="text-left ml-[100px] text-xl ">Ngày kết thúc:</p>
                                <input
                                    type="date"
                                    required
                                    className="w-full max-w-[500px] h-[50px] text-black border border-black rounded-xl mb-3 px-4"
                                    onChange={(e) =>
                                        setNewSemester({ ...newSemester, endDate: e.target.value })
                                    }
                                />
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
                </div>
            )}
        </>
    );
}

export default FormAddSemester;
