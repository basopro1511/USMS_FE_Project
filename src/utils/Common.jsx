import axiosClient from "./AxiosClients";

const doRequest = async (method, url, { data = {}, isUploadImg = false } = {}) => {
  let response = {};
  const token = localStorage.getItem("access_token");
  const reqHeader = {
    "Content-Type": isUploadImg ? "multipart/media" : "application/json",
    Authorization: `Bearer ${token}`,
  };

  try {
    switch (method) {
      case "get":
        response = await axiosClient.get(url, reqHeader);
        break;
      case "post":
        response = await axiosClient.post(url, data, reqHeader);
        break;
      case "put":
        response = await axiosClient.put(url, data, reqHeader);
        break;
      case "delete":
        response = await axiosClient.delete(url, data, reqHeader);
        break;
      default:
        break;
    }
    return response;
  } catch (error) {
    return { error, isError: true };
  }
};

export { doRequest };
