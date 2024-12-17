import axios from "axios";
import { config } from "../config/config";

export function getUserDashboardService() {
  const url = `${config.API_URL}/user/dashboard`;

  return axios.get(url, {
    headers: {
      'Authorization': localStorage.getItem('token'),
    },
  })

}
