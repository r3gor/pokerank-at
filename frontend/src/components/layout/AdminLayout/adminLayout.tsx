import React from 'react'
import { AppShell, Burger, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAppContext } from '../../../context/AppContext';

export const AdminLayout = ({ children }) => {
  const { logout } = useAppContext();
  const [opened, { toggle }] = useDisclosure();

 return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 0,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        {/* <Burger */}
        {/*   opened={opened} */}
        {/*   onClick={toggle} */}
        {/*   hiddenFrom="sm" */}
        {/*   size="sm" */}
        {/* /> */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: 16 }}>
          Pokerank
          <Button color='red' onClick={logout}>Cerrar sesion</Button>
        </div>
      </AppShell.Header>

      {/* <AppShell.Navbar p="md">Navbar</AppShell.Navbar> */}

      <AppShell.Main>{ children }</AppShell.Main>
    </AppShell>
  )
}

