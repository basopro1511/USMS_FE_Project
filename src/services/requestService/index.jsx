import request from "../../utils/baseURL";

export const getRequests = async () => {
    try {
        const response = await request.get("Request")
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
export const AddRequest = async (data) => {
    try {
        const response = await request.post("Request", data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const UpdateRequest = async (data) => {
    try {
        const response = await request.put("Request", data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}
// Change the status of a Request for Teacher
export const changeRequestStatus = async (id, status) => {
    try {
        // Construct the URL with id and status
        const response = await request.get(`/Request/ChangeStatus/${id}/${status}`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}