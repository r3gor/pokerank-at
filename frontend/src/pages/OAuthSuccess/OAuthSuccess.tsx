import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';

export const OAuthSuccess = () => {

  const location = useLocation();
  const { login } = useAppContext();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const token = urlParams.get('token');
    
    if (token) {
      login(token);
    }

  }, [location]);

  return (
    <div>autenticando...</div>
  )
}

