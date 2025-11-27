import axios  from "axios";
import { BASE_URL } from "./constants";


const api = axios.create({
  baseURL : BASE_URL
});

api.interceptors.request.use(

    function (config){
       
        return config;
    }

)
api.interceptors.request.use(

)
export default api;