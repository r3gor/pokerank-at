import axios from "axios";
import { config } from "../config/config";

export function getAdminDashboardService() {
  const url = `${config.API_URL}/admin/dashboard`;

  return axios.get(url, {
    headers: {
      'Authorization': localStorage.getItem('token'),
    },
  })

}
