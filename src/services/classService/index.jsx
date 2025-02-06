import request from "../../utils/baseURL";

//Get all Rooms in Database 
export const getClasses = async () => {
    try {
        const response = await request.get("ClassSubject")
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Add New Class
export const AddClass = async (roomData) => {
    try {
        const response = await request.post("ClassSubject", roomData)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Update Class
export const UpdateClass = async (roomData) => {
    try {
        const response = await request.put("ClassSubject", roomData)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

//Get all Rooms in Database 
export const getClassesIdByMajorId = async (id) => {
    try {
        const response = await request.get(`/ClassSubject/ClassIdsByMajorId/${id}`)
        console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error);
    }
}

// // Change the status of a room
// export const changeRoomStatus = async (id, status) => {
//     try {
//         // Construct the URL with id and status
//         const response = await request.get(`/Room/ChangeStatus/${id}/${status}`);
//         console.log(response.data);
//         return response.data;
//     } catch (error) {
//         console.log(error);
//     }
// }

