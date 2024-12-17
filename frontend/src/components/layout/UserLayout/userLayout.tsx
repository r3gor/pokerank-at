
import React from 'react'
import { AppShell, Burger, Button, Container } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAppContext } from '../../../context/AppContext';
import { useUserContext } from '../../../context/UserContext';
import { Text } from '@mantine/core';

export const UserLayout = ({ children }) => {
  const { logout } = useAppContext();
  const [opened, { toggle }] = useDisclosure();
  const { dashboardData } = useUserContext();

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
        <Container display={'flex'} style={{
            justifyContent: 'space-between',
            height: '100%',
            alignItems: 'center',
          }}>
            <Text
            size="xl"
            fw={900}
            variant="gradient"
            gradient={{ from: 'orange', to: 'blue', deg: 191 }}
          >
            PokeRank
          </Text>
            <Button color='red' variant='outline' onClick={logout}>Salir</Button>
        </Container>
      </AppShell.Header>

      {/* <AppShell.Navbar p="md">Navbar</AppShell.Navbar> */}

      <AppShell.Main>{ children }</AppShell.Main>
    </AppShell>
  )
}

