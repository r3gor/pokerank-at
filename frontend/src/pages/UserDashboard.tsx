import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/AppContext';
import Papa from 'papaparse';

export const UserDashboard = () => {
  const { logout, user, socket } = useAppContext();

  const [csvData, setCsvData] = useState<any[]>([]);
  const [currentMedal, setCurrentMedal] = useState<any>(undefined);
  const [nextMedal, setNextMedal] = useState<any>(undefined);

  useEffect(() => {
    if (user) {
      console.log(user);
      setCurrentMedal(user.medals.find((m: any) => m.missingScore == 0));
      setNextMedal(user.medals.find((m: any) => m.missingScore > 0));
    }
  }, [user])

  const subirPokemon = () => {
    if (socket) {
      socket.emit("addpokemons", {
        pokemons: csvData,
      });
    } else {
      console.error("Socket no está inicializado.");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      Papa.parse(file, {
        complete: (result) => {
          console.log('CSV Parsed Result:', result.data);
          setCsvData(result.data); 
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  return (
    <div>
      <button onClick={logout}>Cerrar sesion</button>
      <h2>Medalla:</h2>
      <p>{ currentMedal? currentMedal.name : "Sin Medalla"}</p>
      <h2>Sgte Medalla:</h2>
      <p>{ nextMedal? `${nextMedal.name} (${ nextMedal.score - nextMedal.missingScore}/${nextMedal.score})` : 'maximo nivel alcanzado'}</p>
      <h1>Subir</h1>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <h2>Datos del CSV</h2>
      <pre>{JSON.stringify(csvData, null, 2)}</pre>
      <button onClick={subirPokemon}>Enviar Pokemones</button>
    </div>
  )
}

