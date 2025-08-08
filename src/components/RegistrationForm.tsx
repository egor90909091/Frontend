import React, { useState } from "react";
import { API_URL } from "../config";

const RegistrationForm = () => {
  const [name, setName] = useState("");
  const [mail, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [role] = useState("USER");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!name || !mail || !password) {
      setError("Заполните все поля!");
      setSuccess("");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, mail, password, role }),
      });
      if (response.ok) {
        setSuccess("Регистрация успешна!");
        setName("");
        setEmail("");
        setPassword("");
      } else {
        const data = await response.json();
        setError(data.message || "Ошибка регистрации");
      }
    } catch (e) {
      setError("Ошибка соединения с сервером");
    } finally {
      setLoading(false);
    }
  };

  const formStyles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      backgroundColor: "#f5f5f5",
      fontFamily: "Arial, sans-serif",
    },
    form: {
      backgroundColor: "white",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "400px",
      border: "1px solid #e0e0e0",
    },
    title: {
      textAlign: "center" as const,
      marginBottom: "30px",
      color: "#333",
      fontSize: "28px",
      fontWeight: "600",
    },
    inputGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      marginBottom: "8px",
      color: "#555",
      fontSize: "14px",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e1e5e9",
      borderRadius: "8px",
      fontSize: "16px",
      transition: "border-color 0.3s ease",
      boxSizing: "border-box" as const,
      outline: "none",
    },
    button: {
      width: "100%",
      padding: "14px",
      backgroundColor: loading ? "#6c757d" : "#007bff",
      color: "white",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: loading ? "not-allowed" : "pointer",
      transition: "background-color 0.3s ease",
      marginTop: "10px",
    },
    errorMessage: {
      backgroundColor: "#f8d7da",
      color: "#721c24",
      padding: "12px",
      borderRadius: "6px",
      border: "1px solid #f5c6cb",
      marginBottom: "20px",
      fontSize: "14px",
    },
    successMessage: {
      backgroundColor: "#d4edda",
      color: "#155724",
      padding: "12px",
      borderRadius: "6px",
      border: "1px solid #c3e6cb",
      marginBottom: "20px",
      fontSize: "14px",
    },
  };

  return (
    <div style={formStyles.container}>
      <form style={formStyles.form} onSubmit={handleSubmit}>
        <h2 style={formStyles.title}>Регистрация</h2>

        {error && <div style={formStyles.errorMessage}>{error}</div>}
        {success && <div style={formStyles.successMessage}>{success}</div>}

        <div style={formStyles.inputGroup}>
          <label style={formStyles.label} htmlFor="name">
            Имя
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={formStyles.input}
            placeholder="Введите имя"
            disabled={loading}
          />
        </div>

        <div style={formStyles.inputGroup}>
          <label style={formStyles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={mail}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={formStyles.input}
            placeholder="Введите email"
            disabled={loading}
          />
        </div>

        <div style={formStyles.inputGroup}>
          <label style={formStyles.label} htmlFor="password">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
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
          onClick={() => window.location.href = '/login'}       
        >         
          Вход       
        </button>
      </div>

        <input type="hidden" value={role} readOnly />

        <button type="submit" style={formStyles.button} disabled={loading}>
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </button>
      </form>
    </div>
  );
};

export default RegistrationForm;
