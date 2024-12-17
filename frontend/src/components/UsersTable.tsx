import React from 'react'
import { TableRowResolver } from '../models/ui/TableRowResolver';
import { UserDashboardModel } from '../models/UserDashboardModel';
import { ActionIcon, ActionIconGroup, Button, Table } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFileCsv, faListCheck } from '@fortawesome/free-solid-svg-icons'
import Papa from 'papaparse';

const UsersTable= ({ 
  items,
  onClickUserUnverified,
}: { 
    items: UserDashboardModel[],
    onClickUserUnverified: (i: UserDashboardModel) => void,
  } ) => {
  const columnsResolver: TableRowResolver<UserDashboardModel>[] = [
    {
      label: () => "ID",
      value: (i) => i.id,
    },
    {
      label: () => "Nombre",
      value: (i) => i.username,
    },
    {
      label: () => "Email",
      value: (i) => i.email,
    },
    {
      label: () => "Subidos",
      value: (i) => i.pokemons.verified.length + i.pokemons.unverified.length,
    },
    {
      label: () => "Aprobados",
      value: (i) => i.pokemons.verified.length,
    },
    {
      label: () => "Pendiente",
      value: (i) => i.pokemons.unverified.length,
    },
    {
      label: () => "Medalla",
      value: (i) => i.medals.verified.name,
    },
    {
      label: () => "Actions",
      value: (i) => <div>
        <ActionIconGroup>
          <ActionIcon onClick={() => onClickUserUnverified(i)}>
            <FontAwesomeIcon icon={faListCheck} />
          </ActionIcon>
          <ActionIcon onClick={() => DownloadCSV([ 
            ...i.pokemons.unverified,
            ...i.pokemons.verified,
          ])}>
            <FontAwesomeIcon icon={faFileCsv}/>
          </ActionIcon>
        </ActionIconGroup>
        </div>,
    },
  ];

  const DownloadCSV = (data: any[]) => {
    const csv = Papa.unparse(data);

    const csvData = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
    const csvURL = window.URL.createObjectURL(csvData);

    const tempLink = document.createElement('a');
    tempLink.href = csvURL;
    tempLink.setAttribute('download', 'download.csv');
    tempLink.click();
  }

  return (
    <div>
      <Table stickyHeader stickyHeaderOffset={60}>
        <Table.Thead>
          <Table.Tr>
            { columnsResolver.map((r, idx) => (
              <Table.Th key={idx}>{r.label()}</Table.Th>
            )) }
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {
            items.map(i => (
              <Table.Tr key={i.id}>
                {
                  columnsResolver.map((c, idx) => (
                    <Table.Td key={idx}>{ c.value(i) }</Table.Td>
                  ))
                }
              </Table.Tr>
            ))
          }
        </Table.Tbody>
        <Table.Caption>Usuarios</Table.Caption>
      </Table>
      </div>
  )
}

export default UsersTable
