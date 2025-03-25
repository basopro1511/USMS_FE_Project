import request from "../../utils/baseURL";

//Get all Rooms in Database 
export const getRooms = async () => {
    try {
        const response = await request.get("Room")
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Add New Room
export const AddRoom = async (roomData) => {
    try {
        const response = await request.post("Room", roomData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Update Room
export const UpdateRoom = async (roomData) => {
    try {
        const response = await request.put("Room", roomData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

// Change the status of a room
export const changeRoomStatus = async (id, status) => {
    try {
        // Construct the URL with id and status
        const response = await request.get(`/Room/ChangeStatus/${id}/${status}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

// Change the status of a room
export const GetAvailableRoom = async (date, slotId) => {
    try {
        // Construct the URL with id and status
        const response = await request.get(`/Room/AvailableRooms/${date}/${slotId}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}
export const GetAvailableRoomToAddExamSchedule = async (date, startTime, endTime) => {
    try {
        const response = await request.get(`/Room/AvailableRoomsToAddExamSchedule/${date}/${startTime}/${endTime}`);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}