import request from "../../utils/baseURL";

//Get all Semesters in Database 
export const getSchedule = async () => {
    try {
        const response = await request.get("Schedule")
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Add New Semester
export const AddSchedule = async (ScheduleData) => {
    try {
        const response = await request.post("Schedule", ScheduleData)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Get all Semesters in Database 
export const getScheduleForStaff = async (majorId, classId, term, startDay, endDay) => {
    try {
        const response = await request.get(`/Schedule/${majorId}/${classId}/${term}/${startDay}/${endDay}`)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
// //Update Semester
// export const UpdateSemester = async (SemesterData) => {
//     try {
//         const response = await request.put("Semester", SemesterData)
//         console.log(response.data)
//         return response.data
//     } catch (error) {
//         console.log(error);
//     }
// }

// // Change the status of a Semester
// export const changeSemesterStatus = async (id, status) => {
//     try {
//         // Construct the URL with id and status
//         const response = await request.get(`/Semester/ChangeStatus/${id}/${status}`);
//         console.log(response.data);
//         return response.data;
//     } catch (error) {
//         console.log(error);
//     }
// }

