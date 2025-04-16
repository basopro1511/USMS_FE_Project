import request from "../../utils/baseURL";

//#region Get Schedule
// Get all Semesters in Database
export const getSchedule = async () => {
    try {
        const response = await request.get("Schedule");
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region Add Schedule
// Add New Schedule
export const AddSchedule = async (ScheduleData) => {
    try {
        const response = await request.post("Schedule", ScheduleData);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region Update Schedule
// Update Schedule
export const UpdateSchedule = async (ScheduleData) => {
    try {
        const response = await request.put("Schedule", ScheduleData);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region Delete Schedule
// Delete Schedule by ID
export const DeleteSchedule = async (id) => {
    try {
        const response = await request.delete(`Schedule/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region Get Schedule by Id
export const GetScheduleById = async (id) => {
    try {
        const response = await request.get(`Schedule/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region Get Schedule for Staff
// Get all Semesters in Database
export const getScheduleForStaff = async (majorId, classId, term, startDay, endDay) => {
    try {
        const response = await request.get(`/Schedule/${majorId}/${classId}/${term}/${startDay}/${endDay}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region Get Schedule for Staff
// Get all Semesters in Database
export const getScheduleForStaffByDay = async (majorId, classId, term, day) => {
    try {
        const response = await request.get(`/Schedule/${majorId}/${classId}/${term}/${day}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region Get Schedule for Student
// Get all Schedule for student in Database
export const getScheduleForStudent = async (studentId, startDay, endDay) => {
    try {
        const response = await request.get(`/Schedule/Student/${studentId}/${startDay}/${endDay}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region Get Schedule for Teacher
// Get all Schedule for Teacher in Database
export const getScheduleForTeacher = async (teacherId, startDay, endDay) => {
    try {
        const response = await request.get(`/Schedule/Teacher/${teacherId}/${startDay}/${endDay}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region Get Availables Teacher for add Schedule
// Get all Availables Teacher for add Schedule
export const getAvailableTeachersForAddSchedule = async (majorId, date, slot) => {
    try {
        const response = await request.get(`/Schedule/AvailableTeachers/${majorId}/${date}/${slot}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region Change Schedule Status
export const ChangeScheduleStatus = async (majorId,classId,term, status) => {
    try {
        const response = await request.put(`/Schedule/ChangeStatus/${majorId}/${classId}/${term}/${status}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion

//#region Auto Schedule
export const AutoSchedule = async (newData) => {
    try {
      const params = new URLSearchParams();
      if (newData.majorId) params.append("majorId", newData.majorId);
      if (newData.semesterId) params.append("semesterId", newData.semesterId);
      if (newData.classId) params.append("classId", newData.classId);
      if (newData.term) params.append("term", newData.term);
      const response = await request.post(
        `/Schedule/autoSchedule?${params.toString()}`,
        newData.scheduledDays // <-- gửi body là array of DayOfWeek numbers
      );
  
      return response.data;
    } catch (error) {
      console.error("Lỗi auto schedule:", error);
      throw error;
    }
  };
  
//#endregion

export const getClassSubjectIdByTeacherSchedule = async (teacherId) => {
    try {
        const response = await request.get(`/Schedule/ClassScheduleId/${teacherId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const GetSlotNoInSubjectByClassSubjectId = async (id) => {
    try {
        const response = await request.get(`/Schedule/SlotNoInSubject/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
export const GetScheduleDataByScheduleIdandSlotInSubject = async (id,slot) => {
    try {
        const response = await request.get(`/Schedule/GetScheduleByIdAndSlotInSubject/${id}/${slot}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};