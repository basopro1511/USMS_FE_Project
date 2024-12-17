import request from "../../utils/baseURL";

export const getRooms = async () => {
    try {
        const response = await request.get("Room")
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

export const AddRoom = async (roomData) => {
    try {
        const response = await request.post("Room", roomData)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}