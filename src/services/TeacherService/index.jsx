import request from "../../utils/baseURL";

//Get all Students in Database 
export const getTeachers = async () => {
    try {
        const response = await request.get("Teacher")
        return response.data
    } catch (error) {
        console.log(error);
    }
}
//Add New Teacher
export const AddTeacher = async (teacherData) => {
    try {
        const response = await request.post("Teacher", teacherData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
//Update Teacher
export const UpdateTeacher = async (teacherData) => {
    try {
        const response = await request.put("Teacher", teacherData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}