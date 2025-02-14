import request from "../../utils/baseURL";

//Get all Students in Database 
export const getStudents = async () => {
    try {
        const response = await request.get("Student")
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Add New Student
export const AddStudent = async (StudentData) => {
    try {
        const response = await request.post("Student", StudentData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const GetStudentById = async (id) => {
    try {
        const response = await request.get(`/Student/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Update Student
export const UpdateStudent = async (StudentData) => {
    const userId = StudentData.userId
    try {
        const response = await request.put(`Student/${userId}`, StudentData);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

// Change the status of a Student
export const changeStudentStatus = async (id, status) => {
    try {
        // Construct the URL with id and status
        const response = await request.get(`/Student/ChangeStatus/${id}/${status}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}