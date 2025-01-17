import request from "../../utils/baseURL";

//Get all Semesters in Database 
export const getSemesters = async () => {
    try {
        const response = await request.get("Semester")
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Add New Semester
export const AddSemester = async (SemesterData) => {
    try {
        const response = await request.post("Semester", SemesterData)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Update Semester
export const UpdateSemester = async (SemesterData) => {
    try {
        const response = await request.put("Semester", SemesterData)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

// Change the status of a Semester
export const changeSemesterStatus = async (id, status) => {
    try {
        // Construct the URL with id and status
        const response = await request.get(`/Semester/ChangeStatus/${id}/${status}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

