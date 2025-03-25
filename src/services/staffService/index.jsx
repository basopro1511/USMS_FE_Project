import request from "../../utils/baseURL";

//Get all Students in Database 
export const GetStaffs = async () => {
    try {
        const response = await request.get("Staff")
        return response.data
    } catch (error) {
        console.log(error);
    }
}
//Add New Teacher
export const AddStaff = async (staffData) => {
    try {
        const response = await request.post("Staff", staffData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
//Update Teacher
export const UpdateStaff = async (staffData) => {
    try {
        const response = await request.put("Staff", staffData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//#region import teacher
export const importStaff = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        const response = await request.post("/Staff/import", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Import error:", error);
        throw error;
    }
};
//#endregion