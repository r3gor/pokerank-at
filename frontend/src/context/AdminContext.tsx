
import { createContext, useContext, useEffect, useState } from "react";
import { UserDashboardModel } from "../models/UserDashboardModel";
import { useAppContext } from "./AppContext";
import { getAdminDashboardService } from "../services/getAdminDashboard";

interface AdminContextType {
  dashboardData: UserDashboardModel[],
  setDashboardData: React.Dispatch<UserDashboardModel[]>,
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }) => {
  const [ dashboardData, setDashboardData ] = useState<any>(undefined);

  return (
  <AdminContext.Provider value={{ dashboardData, setDashboardData }}>
      { children }
  </AdminContext.Provider>
  )
}

export const useAdminContext = (): AdminContextType => {
  const context = useContext(AdminContext);
  const { user, socket, isSocketConnected } = useAppContext();

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
  }, [user])

  useEffect(() => {
    if (socket && isSocketConnected) {
      socket.on("dashboard-update", (p) => {
        console.log("dashboard-update", p);
        context?.setDashboardData(p);
      });
    }
  }, [socket, isSocketConnected])

  const fetchDashboardData = async () => {
    const res = await getAdminDashboardService();
    context?.setDashboardData(res.data);
  }
  if (!context) {
    throw new Error('useAdminContext must be used within an AppProvider');
  }
  return context;
}
