import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Добро пожаловать на наш сайт!</h1>
      <p>Пожалуйста, выберите действие:</p>

      <button
        style={{ marginRight: '10px', padding: '10px 20px', fontSize: '16px' }}
        onClick={() => navigate('/register')}
      >
        Регистрация
      </button>

      <button
        style={{ padding: '10px 20px', fontSize: '16px' }}
        onClick={() => navigate('/login')}
      >
        Вход
      </button>
    </div>
  );
};

export default HomePage;
