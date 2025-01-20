import request from "../../utils/baseURL";

//Get all Rooms in Database 
export const getMajors = async () => {
    try {
        const response = await request.get("Major")
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}