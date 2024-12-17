import axios from "axios";

const request = axios.create({
  baseURL: "https://localhost:7131/api/",
});

export default request;