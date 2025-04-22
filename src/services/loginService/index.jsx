import request from "../../utils/baseURL";

export const LoginJWT = async (loginData) => {
    try {
        const response = await request.post("Auth", loginData)
        return response.data
    } catch (error) {
        console.log(error);
    }
}