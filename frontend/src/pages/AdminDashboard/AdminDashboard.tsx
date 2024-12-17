import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import { useAdminContext } from '../../context/AdminContext';
import { Table } from '@mantine/core';
import UsersTable from '../../components/UsersTable';
import { PokemonsTable } from '../../components/PokemonsTable';
import { UserPokemon } from '../../models/UserPokemon';

export const AdminDashboard = () => {

  const { isSocketConnected, socket } = useAppContext();
  const { dashboardData } = useAdminContext();
  const [ userIdPokeUnverified, setUserIdPokeUnverified ] = useState<number | null>(null);
  const [ msg, setMsg ] = useState<any>();

  const getUnverifiedPokemons = (userId: number) => {
    return dashboardData.find(u => u.id == userId)?.pokemons.unverified || []
  }

  const handleAprobarUserPokemon = (pokemons: UserPokemon[]) => {
    socket?.emit("admin-check-pokemons", { 
      pokemons, action: 'aprobacion'
    } );
  };

  const handleRechazarUserPokemon = (pokemons: UserPokemon[]) => {
    socket?.emit("admin-check-pokemons", { 
      pokemons, action: 'rechazo'
    } );
  }

  return (
    <div>
      <h1>Admin</h1>
        { dashboardData && <UsersTable 
          items={dashboardData}
          onClickUserUnverified={(i) => setUserIdPokeUnverified(i.id)}
        />
        }

        {
          userIdPokeUnverified && <PokemonsTable 
            items={ getUnverifiedPokemons(userIdPokeUnverified) }
            onClickAprobarPokemon={ (p) => handleAprobarUserPokemon([p]) }
            onClickRechazarPokemon={ (p) => handleRechazarUserPokemon([p]) }
          />
        }

      {/* <pre>{JSON.stringify(msg)}</pre> */}
      </div>
  )
}

