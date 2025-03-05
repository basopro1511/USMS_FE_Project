import request from "../../utils/baseURL";

export const getExamSchedules = async () => {
    try {
        const response = await request.get("ExamSchedule");
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

//Add New Class
export const AddExamSchedule = async (examData) => {
    try {
        const response = await request.post("ExamSchedule", examData)
        console.log(response.data);
        return response.data
    } catch (error) {
        console.log(error);
    }
}
export const UpdateExamSchedule = async (examData) => {
    try {
        const response = await request.put("ExamSchedule", examData)
        console.log(response.data);
        return response.data
    } catch (error) {
        console.log(error);
    }
}
//#region Get SubjectId for Add Exam Schedule
// Get SubjectId for Add Exam Schedule
export const getSubjectIdsForAddExamSchedule = async (majorId, semesterId) => {
    try {
        const response = await request.get(`/ClassSubject/SubjectIds/${majorId}/${semesterId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region Available Teacher To Add Exam Schedule
export const getAvailalbeTeacherForAddExamSchedule = async (date, startTime, endTime) => {
    try {
        const response = await request.get(`/ExamSchedule/AvailableTeachers/${date}/${startTime}/${endTime}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region Get Exam Schedule for Student
export const getExamScheduleForStudent = async (id) => {
    try {
        const response = await request.get(`/ExamSchedule/Student/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region Get Exam Schedule for Student
export const getExamScheduleForTeacher = async (id) => {
    try {
        const response = await request.get(`/ExamSchedule/Teacher/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion

// Get Available Room To Add Exam Schedule
export const GetAvailableRoomToAddExamSchedule = async (date, startTime, endTime) => {
    try {
        const response = await request.get(`/Room/AvailableRoomsToAddExamSchedule/${date}/${startTime}/${endTime}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}