/* eslint-disable react/prop-types */
import { useState } from "react";
import { DeleteStudentInClass } from "../../../services/studentInClassService";

function PopUpRemoveStudentInClass({ onStudentRemove, student }) {
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [showAlert, setShowAlert] = useState(false); // Alert for success or failure notification
    const [isFormVisible, setIsFormVisible] = useState(true);
  
    const handleCancel = () => {
        setIsFormVisible(false); // Ẩn form khi nhấn nút hủy
    };

    //  Xử lý khi nhấn "Xóa"
     const handleDeleteClick = async () => {
       setErrorMessage("");
       setSuccessMessage("");
       setShowAlert(false);
   
       try {
         const response = await DeleteStudentInClass(student.studentClassId);
         console.log(student);
         if (response.isSuccess) {
           setSuccessMessage(response.message);
           setShowAlert("success");
           setTimeout(() => {
             setShowAlert(false);
             onStudentRemove(student.studentClassId);
           }, 2000);
           setIsFormVisible(false); 
         } else {
           setErrorMessage(response.message);
           setShowAlert("error");
           setTimeout(() => setShowAlert(false), 3000);
         }
       } catch (error) {
         setErrorMessage(error);
         setShowAlert("error");
         setTimeout(() => setShowAlert(false), 3000);
       }
     };

    return (
        <>
          {/* Notification Start */}
      <>
        {showAlert && (
          <div
            className={`fixed top-5 right-0 z-50 ${
              showAlert === "error"
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
                    <strong>Thất bại:</strong> {errorMessage}
                  </span>
                ) : (
                  <span>
                    <strong>Thành công:</strong> {successMessage}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </>
      {/* Notification End */}
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

            
        </>
    );
}

export default PopUpRemoveStudentInClass;
