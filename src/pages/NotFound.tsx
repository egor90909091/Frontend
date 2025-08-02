import React from 'react';

const NotFound: React.FC = () => {
  return (
    <div style={styles.container}>
      <h1 style={styles.code}>404</h1>
      <p style={styles.message}>Страница не найдена</p>
      <a href="/" style={styles.link}>Вернуться на главную</a>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center' as const,
    marginTop: '10vh',
    fontFamily: 'Arial, sans-serif',
  },
  code: {
    fontSize: '6rem',
    margin: 0,
    color: '#ff6b6b',
  },
  message: {
    fontSize: '1.5rem',
    margin: '20px 0',
  },
  link: {
    fontSize: '1.1rem',
    color: '#3498db',
    textDecoration: 'none',
  },
};

export default NotFound;
