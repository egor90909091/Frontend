// src/pages/RegisterPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';

const RegisterPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
      

      <div style={{ padding: '20px' }}>
        <h1>Страница регистрации</h1>
        <RegistrationForm />
      </div>
    </div>
  );
};

export default RegisterPage;