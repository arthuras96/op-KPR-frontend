import axios from "axios";

const CepApi = axios.create({
    baseURL: "https://api.postmon.com.br/v1/cep/"
});

export default CepApi;