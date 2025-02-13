import request from "../../utils/baseURL";


export const GetStudentDataByClassId = async (id) => {
    try {
        const response = await request.get(`/StudentInClass/ClassId/${id}`)
        console.log(response.data);
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const AddStudentToClass = async (data) => {
    try {
        const response = await request.post("StudentInClass", data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const getAvailableStudent = async (id) => {
    try {
        const response = await request.get(`/StudentInClass/AvailableStudent/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
export const DeleteStudentInClass = async (id) => {
    try {
        const response = await request.delete("StudentInClass", id)
        return response.data;
    } catch (error) {
        console.log(error);
    }
};

export const AddMultipleStudentToClass = async (data) => {
    try {
        const response = await request.post("/StudentInClass/AddMultipleStudents", data);
        return response.data;
    } catch (error) {
        console.error("Error adding multiple students to class:", error);
        return { isSuccess: false, message: "Failed to add multiple students." };
    }
};

