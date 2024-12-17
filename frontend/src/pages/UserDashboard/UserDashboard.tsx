import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext';
import Papa from 'papaparse';
import { useUserContext } from '../../context/UserContext';
import { Badge, Button, Container, FileInput, Text } from '@mantine/core';
import { PieChart } from '@mantine/charts';
import Medal from '../../components/Medal';
import { Table, TableData } from '@mantine/core';
import styles from './styles.module.css';

export const UserDashboard = () => {
  const { logout, user, socket, isSocketConnected } = useAppContext();
  const { dashboardData } = useUserContext();
  const medals = dashboardData?.medals;

  const [csvData, setCsvData] = useState<any[]>([]);
  // const [tableData, setTableData] = useState<TableData | null>(null);

  const [msg, setMsg] = useState<any>();

  const subirPokemon = () => {
    socket?.emit("add-pokemons", csvData);
    setCsvData([]);
  };

  const getTablaCsvData = () => {
    return {
      caption: 'CSV Cargado',
      head: ['ID', 'Name', 'Power'],
      body: csvData.map((o) => Object.values(o)),
    } as TableData;
  }
  const getChartData = () => {
    const veri = dashboardData?.medals?.verified?.currentScore;
    const tota = dashboardData?.medals?.unverified?.currentScore;
    return [
      { name: 'Aceptados', value: veri, color: 'teal.6' },
      { name: 'Pendientes', value: tota - veri, color: 'yellow.6' },
    ]
  }

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  // const file = e.target.files?.[0];
  const handleFileChange = (file: File | null) => {
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

  if (!dashboardData) return <div></div>;

  return (
    <Container>
    <div className={styles.Container}>
      <div className={styles.SectionOne}>
        <div className={styles.Profile}>
          <h1> Bienvenido, </h1>
          <Text size='xl' fw={700}> {dashboardData.username} </Text>
          <Text size='md'> {dashboardData.email} </Text>
          <div style={{paddingTop: 8}}> 
            <Badge color="blue">{ medals.verified.name }</Badge>
          </div>
        </div>
        <PieChart withLabelsLine labelsPosition="outside" labelsType="value" withLabels data={getChartData()} withTooltip />
      </div>
        {/* <pre>{JSON.stringify(msg)}</pre> */}

        <div>
          <h2>Medallas</h2>
          <div className={styles.MedalContainer}>
            <Medal 
              medalName={medals.verified.name} 
              verified={true} 
              medalScore={medals.verified.score}
              userScore={medals.verified.currentScore}
            />
            <Medal 
              medalName={medals.unverified.name} 
              verified={false} 
              medalScore={medals.unverified.score}
              userScore={medals.unverified.currentScore}
            />
          </div>
        </div>

        <div>
          <FileInput
          className={styles.InputFile}
          size="xl"
          label="Subir"
          description="Carga tu .csv con pokemones"
          placeholder="Click aqui para cargar un archivo csv"
          accept='.csv'
          onChange={handleFileChange}
          clearable
        />
        </div>

        <div>
          {csvData.length > 0 && <>
            {csvData.length > 0 && <Table data={getTablaCsvData()} />}
              <Button variant="filled" onClick={subirPokemon}>Enviar</Button>
            </>}
        </div>

      </div>
      </Container>
  )
}

