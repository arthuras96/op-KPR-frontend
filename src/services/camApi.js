import axios from "axios";

const CamApi = axios.create({
    baseURL: "",
    // headers: { "Authorization": "Basic " }
    responseType: 'blob'
});

export default CamApi;