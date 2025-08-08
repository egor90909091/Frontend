import React, { useState } from "react";
import { API_URL } from "../config";

const LoginForm = () => {
  const [mail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!mail || !password) {
      setError("Заполните все поля");
      setSuccess("");
      return;
    }
    
    setError("");
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        credentials: 'include',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mail, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('[LoginForm] Ответ от сервера:', data);

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        console.log('[LoginForm] Токены сохранены:', data.accessToken, data.refreshToken);
        setSuccess("Вход выполнен успешно!");
        setTimeout(() => window.location.href = "/dashboard", 1000);
      } else {
        const data = await response.json();
        setError(data.message || "Ошибка входа");
      }
    } catch (e) {
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  const formStyles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif',
    },
    form: {
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px',
      border: '1px solid #e0e0e0',
    },
    title: {
      textAlign: 'center' as const,
      marginBottom: '30px',
      color: '#333',
      fontSize: '28px',
      fontWeight: '600',
    },
    inputGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#555',
      fontSize: '14px',
      fontWeight: '500',
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '2px solid #e1e5e9',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'border-color 0.3s ease',
      boxSizing: 'border-box' as const,
      outline: 'none',
    },
    inputFocus: {
      borderColor: '#007bff',
    },
    button: {
      width: '100%',
      padding: '14px',
      backgroundColor: loading ? '#6c757d' : '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'background-color 0.3s ease',
      marginTop: '10px',
    },
    errorMessage: {
      backgroundColor: '#f8d7da',
      color: '#721c24',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #f5c6cb',
      marginBottom: '20px',
      fontSize: '14px',
    },
    successMessage: {
      backgroundColor: '#d4edda',
      color: '#155724',
      padding: '12px',
      borderRadius: '6px',
      border: '1px solid #c3e6cb',
      marginBottom: '20px',
      fontSize: '14px',
    },
  };

  return (
    
    <div style={formStyles.container}>
      <div style={formStyles.form}>
        <h2 style={formStyles.title}>Вход в систему</h2>

        {error && <div style={formStyles.errorMessage}>{error}</div>}
        {success && <div style={formStyles.successMessage}>{success}</div>}

        <div style={formStyles.inputGroup}>
          <label style={formStyles.label}>Email</label>
          <input
            type="email"
            value={mail}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={formStyles.input}
            placeholder="Введите ваш email"
            disabled={loading}
          />
        </div>

        <div style={formStyles.inputGroup}>
          <label style={formStyles.label}>Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={formStyles.input}
            placeholder="Введите пароль"
            disabled={loading}
          />
        </div>
          <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <button         
          style={{ 
            marginRight: '10px', 
            padding: '5px 10px', 
            fontSize: '12px',
            backgroundColor: '#f8f9fa',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}         
          onClick={() => window.location.href = '/register'}       
        >         
          Регистрация      
        </button>
      </div>
        <button 
          onClick={handleSubmit}
          style={formStyles.button}
          disabled={loading}
        >
          {loading ? "Вход..." : "Войти в аккаунт"}
        </button>
      </div>
      
   
      
    </div>
  );
};

export default LoginForm;