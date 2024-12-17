import { createContext, useContext, useEffect, useState } from "react";
import { useAppContext } from "./AppContext";
import { getUserDashboardService } from "../services/getUserDashboard";
import { UserDashboardModel } from "../models/UserDashboardModel";

interface UserContextType {
  dashboardData: UserDashboardModel,
  setDashboardData: React.Dispatch<UserDashboardModel>,
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }) => {
  const [ dashboardData, setDashboardData ] = useState<any>(undefined);

  return (
  <UserContext.Provider value={{ dashboardData, setDashboardData }}>
      { children }
  </UserContext.Provider>
  )
}

export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
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
    const res = await getUserDashboardService();
    context?.setDashboardData(res.data);
  }

  if (!context) {
    throw new Error('useUserContext must be used within an AppProvider');
  }
  return context;
}
