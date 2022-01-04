import axios from "axios";
import { GetToken, GetIdPerson, GetIdAdmin } from "./auth";

const Api = axios.create({
    baseURL: "https://localhost:4001"
});

Api.interceptors.request.use(async config => {
    const token = GetToken();
    const idPerson = GetIdPerson();
    const idAdmin = GetIdAdmin();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
        config.headers["content-type"] = "application/json";
        config.headers["idperson"] = `${idPerson}`;
        config.headers["idadmin"] = `${idAdmin}`;
    }
    // console.log(config);
    return config;
});

export default Api;