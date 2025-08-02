// src/pages/RegisterPage.tsx
import React from 'react';
import LoginForm from '../components/LoginForm';

const LoginPage= () => {
  return (
    <div style={{ position: 'relative', minHeight: '100vh' }}>
     
      

      <div style={{ padding: '20px' }}>
        <h1>Страница регистрации</h1>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;