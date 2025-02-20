import request from "../../utils/baseURL";

//Get all Slot in Database
export const getSlots = async () => {
  try {
    const response = await request.get("Slot");
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Add New Slot
export const AddSlot = async (slotData) => {
  try {
    const response = await request.post("Slot", slotData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

//Update slot
export const UpdateSlot = async (slotData) => {
  try {
    const response = await request.put("Slot", slotData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Change the status of a slot
export const changeSlotStatus = async (id, status) => {
  try {
    // Construct the URL with id and status
    const response = await request.get(`/Slot/ChangeStatus/${id}/${status}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

// Get Slot By Id
export const getSlotById = async (id) => {
  try {
    const response = await request.get(`/Slot/${id}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
