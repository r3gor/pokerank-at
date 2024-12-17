import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserService } from '../services/getUser';
import { io, Socket } from 'socket.io-client';
import { config } from '../config/config';

interface AppContextType {
  authToken: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  user: any;
  isSocketConnected: boolean;
  socket: Socket | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);
let socket: Socket;

export const AppProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const navigate = useNavigate();
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      login(token);
    } else {
      logout();
    }
  }, []);

  const initSocket = (token: string) => {
    socket = io(config.WEBSOCKET_URL, {
      query: { token: token || "" },
    });

    socket.on("connect", () => {
      console.log("Socket conectado");
      setIsSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Socket desconectado");
      setIsSocketConnected(false);
    });
  }

  const login = async (token: string) => {
    localStorage.setItem('token', token);
    try {
      const res = await getUserService();
      const user = res.data;
      setUser(user);
      initSocket(token);
      setAuthToken(token);

      if (user.user.role == 'ad') {
        navigate('/admin/dashboard');
      } else {
        navigate('/user/dashboard');
      }

    } catch (err) {
      console.error(err);
      logout();
      throw err;
    }
  };

  const logout = () => {
    console.log("logout");
    socket?.disconnect();
    localStorage.removeItem('token');
    setAuthToken(null);
    navigate('/');
  };

  return (
    <AppContext.Provider value={{ 
      user, authToken, login, logout, isAuthenticated: !!authToken,
      isSocketConnected, socket,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
