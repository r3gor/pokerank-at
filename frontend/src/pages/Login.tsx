import React from 'react'
import { config } from '../config/config';
import { useNavigate } from 'react-router-dom';

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
    <>
      <button onClick={handleLogin}>Iniciar sesión con Google (Usuario)</button>
      <button onClick={handleLoginAdmin}>Iniciar sesión (Admin)</button>
    </>

  )
}

