import axios from "axios";
import { config } from "../config/config";

export function getUserService() {
  const url = `${config.API_URL}/user`;

  return axios.get(url, {
    headers: {
      'Authorization': localStorage.getItem('token'),
    },
  })

}
