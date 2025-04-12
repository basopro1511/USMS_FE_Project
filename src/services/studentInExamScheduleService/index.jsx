import request from "../../utils/baseURL";

export const GetStudentDataByExamScheduleId = async (id) => {
    try {
        const response = await request.get(`/StudentInExamSchedule/${id}`)
        console.log(response.data);
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const GetAvailableStudentInExamSchedule = async (id) => {
    try {
        const response = await request.get(`/StudentInExamSchedule/AvailableStudents/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
export const AddStudentToClassExamSchedule = async (data) => {
    try {
        const response = await request.post("StudentInExamSchedule", data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
//#region Delete Student In Class Exam Schedule
export const DeleteStudentInClassExamSchedule = async (id) => {
    try {
        const response = await request.delete(`/StudentInExamSchedule/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion
export const AddMultipleStudentToExamSchedule = async (data) => {
    try {
        const response = await request.post("StudentInExamSchedule/AddMutipleStudents", data);
        return response.data;
    } catch (error) {
        console.error("Error adding multiple students to class:", error);
        return { isSuccess: false, message: "Failed to add multiple students." };
    }
};
