import request from "../../utils/baseURL";

//#region Get Schedule
// Get all Semesters in Database
export const getSchedule = async () => {
    try {
        const response = await request.get("Schedule");
        console.log(response.data);
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

//#region Get ScheduleDetails
export const getScheduleDetails = async (scheduleId) => {
    try {
        const response = await request.get(`/Schedule/ScheduleDetails/${scheduleId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
//#endregion
