import React from 'react';
import './App.css'
import '@mantine/core/styles.css';
import '@mantine/charts/styles.css';
import AppRouter from './routes/AppRouter';
import { MantineProvider } from '@mantine/core';

function App() {
  return (
    <>
      <MantineProvider forceColorScheme={'dark'}>
        <AppRouter />
      </MantineProvider>
    </>
  )
}

export default App
