import request from "../../utils/baseURL";

//Get all Classes by major in Database 
export const GetUserByID = async (id) => {
    try {
        const response = await request.get(`/User/${id}`)
        return response.data
    } catch (error) {
        console.log(error);
    }
}