import axios from "axios";

export default axios.create({
    baseURL: "https://control-systems.herokuapp.com/api/",
});