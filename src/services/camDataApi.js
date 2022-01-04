import axios from "axios";

const CamDataApi = axios.create({
    baseURL: "",
    // headers: { "Authorization": "Basic " }
});

// CamDataApi.interceptors.request.use(async config => {
//     console.log(config);
//     return config;
// });

export default CamDataApi;