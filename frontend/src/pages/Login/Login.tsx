import React from 'react'
import { config } from '../../config/config';
import { useNavigate } from 'react-router-dom';
import { Button, Text } from '@mantine/core';
import styles from './styles.module.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const authURL = `${config.API_URL}/auth/google`;

  const handleLogin = () => {
    window.location.href = authURL;
  };

  const handleLoginAdmin = () => {
    navigate('/auth/success?token=ADMINTOKEN');
  };

  return (
    <div className={styles.Container}>
      <Text
        style={{ fontSize: 100 }}
        size="xl"
        fw={900}
        variant="gradient"
        gradient={{ from: 'orange', to: 'blue', deg: 191 }}
      > 
      PokeRank
      </Text>

      <div className={styles.ButtonsContainer}>
        <Button color='blue' onClick={handleLogin}>Iniciar sesión con Google (Usuario)</Button>
        <Button color='grape' onClick={handleLoginAdmin}>Iniciar sesión (Admin)</Button>
      </div>
    </div>

  )
}

