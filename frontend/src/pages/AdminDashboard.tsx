import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext';

export const AdminDashboard = () => {

  const { logout, user, login, authToken, isSocketConnected, socket } = useAppContext();
  const [ msg, setMsg ] = useState<any>();

  useEffect(() => {
    if (!socket || !isSocketConnected) return;
    socket.on("pokemonssubidos-admin", (p) => {
      console.log("pokemonssubidos-admin:", p);
      setMsg(p);
    });
  }, [isSocketConnected, socket])

  return (
    <div>
      <h1>Admin</h1>
      <button onClick={logout}>Cerrar sesion</button>
      <pre>
        {JSON.stringify(msg, null, 2)}
      </pre>
    </div>
  )
}

