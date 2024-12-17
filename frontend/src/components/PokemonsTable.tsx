import React, { ReactNode, useState } from 'react'
import { UserPokemon } from '../models/UserPokemon';
import { ActionIcon, ActionIconGroup, Checkbox, Table } from '@mantine/core';
import { TableRowResolver } from '../models/ui/TableRowResolver';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCheck, faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { TableAction } from '../models/ui/TableActions';

export const PokemonsTable = ({ items, onClickAprobarPokemon, onClickRechazarPokemon }: {
  items: UserPokemon[]
  onClickAprobarPokemon: (i: UserPokemon) => void,
  onClickRechazarPokemon: (i: UserPokemon) => void
} ) => {

  const [selected, setSelected] = useState<number[]>([]);

  const handleSelectAll = (check: boolean) => {
    console.log("select all");
  }

  const actions: TableAction<UserPokemon>[] = [
    { 
      label: 'Aprobar',
      icon: faSquareCheck,
      handler: (i) => () => onClickAprobarPokemon(i),
      color: 'green',
    },
    {
      label: 'Rechazar',
      icon: faSquareXmark,
      handler: (i) => () => onClickRechazarPokemon(i),
      color: 'red',
    }
  ]

  const rowsResolver: TableRowResolver<UserPokemon>[] = [
    // {
    //   label: () => (
    //     <div>
    //       <Checkbox
    //         checked={items.length == selected.length}
    //         onChange={(e) => handleSelectAll(e.currentTarget.checked)}
    //       />
    //     </div>
    //   ),
    //   value: (i) => (
    //     <div>
    //         <Checkbox
    //           checked={selected.includes(i.pokemon_id)}
    //           onChange={() => {
    //             const checked = selected.includes(i.pokemon_id);
    //             if (checked) {
    //               setSelected(s => s.filter(e => e != i.pokemon_id))
    //             } else {
    //               setSelected(s => [...s, i.pokemon_id])
    //             }
    //           }}
    //         />
    //     </div>
    //   )
    // },
    {
      label: () => "Pokemon ID",
      value: (i) =>  i.pokemon_id,
    },
    {
      label: () => "Name",
      value: (i) =>  i.name,
    },
    {
      label: () => "Poder",
      value: (i) =>  i.power,
    },
    {
      label: () => "Verificado Antes",
      value: (i) =>  i.pokemon_status == 'acep'? 'SI' : 'NO',
    },
    {
      label: () => "Aprobar",
      value: (i) => <>
        <ActionIconGroup>
          { actions.map((a, idx) => <ActionIcon key={idx} color={a.color} onClick={a.handler(i)}>
            <FontAwesomeIcon icon={a.icon} />
            </ActionIcon>
          ) }
        </ActionIconGroup>
      </>
    }
  ];

  return (
    <Table stickyHeader stickyHeaderOffset={8}>
      <Table.Thead>
        <Table.Tr>
          {
            rowsResolver.map((r, idx) => (
              <Table.Th key={idx}>{ r.label() }</Table.Th>
            ))
          }
        </Table.Tr>
      </Table.Thead>
        <Table.Tbody>
        {
          items.map(i => (
            <Table.Tr key={i.pokemon_id}>
              {
                rowsResolver.map((r, idx) => (
                  <Table.Td key={idx}>{ r.value(i) }</Table.Td>
                ))
              }
            </Table.Tr>
          ))
        }
      </Table.Tbody>
        <Table.Caption>Pokemons</Table.Caption>
      </Table>

  )
}

