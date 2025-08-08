import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';

interface User {
  id: number;
  name: string;
  mail: string;
  role: string;
}

interface UpdateUserDto {
  name?: string;
  mail?: string;
  role?: string;
}

// Функция для декодирования JWT
function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [updateData, setUpdateData] = useState<UpdateUserDto>({});
  const [editingProfile, setEditingProfile] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setError("Нет accessToken");
        setLoading(false);
        return;
      }

      const payload = parseJwt(token);
      const userId = payload?.sub;

      if (!userId) {
        setError("Не удалось получить ID пользователя из токена");
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Ошибка загрузки данных пользователя');
        }

        const data: User = await res.json();
        setUser(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const fetchAllUsers = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError("Нет accessToken");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Ошибка загрузки списка пользователей');
      }

      const data: User[] = await res.json();
      setAllUsers(data);
      setShowAllUsers(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const updateUser = async (userId: number, updateData: UpdateUserDto) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError("Нет accessToken");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        throw new Error('Ошибка обновления пользователя');
      }

      const updatedUser: User = await res.json();
      
      // Обновляем список пользователей
      setAllUsers((prev: User[]) => prev.map((u: User) => u.id === userId ? updatedUser : u));
      setEditingUser(null);
      setUpdateData({});
      
      // Если обновляем текущего пользователя, обновляем и его данные
      if (user && user.id === userId) {
        setUser(updatedUser);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteUser = async (userId: number) => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError("Нет accessToken");
      return;
    }

    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error('Ошибка удаления пользователя');
      }

      // Удаляем пользователя из списка
      setAllUsers((prev: User[]) => prev.filter((u: User) => u.id !== userId));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const startEdit = (userToEdit: User) => {
    setEditingUser(userToEdit);
    setUpdateData({
      name: userToEdit.name,
      mail: userToEdit.mail,
      role: userToEdit.role,
    });
  };

  const startProfileEdit = () => {
    if (user) {
      setEditingProfile(true);
      setUpdateData({
        name: user.name,
        mail: user.mail,
        role: user.role,
      });
    }
  };

  const cancelEdit = () => {
    setEditingUser(null);
    setEditingProfile(false);
    setUpdateData({});
  };

  const updateProfile = async () => {
    if (!user) return;
    
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setError("Нет accessToken");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) {
        throw new Error('Ошибка обновления профиля');
      }

      const updatedUser: User = await res.json();
      setUser(updatedUser);
      setEditingProfile(false);
      setUpdateData({});
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    // Удаляем токены из localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    // Перенаправляем на страницу логина
    window.location.href = '/login';
  };



  if (loading) return <div>Загрузка...</div>;
  if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;
  if (!user) return <div>Пользователь не найден</div>;

  const isAdmin = user.role === 'ADMIN';

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Добро пожаловать, {user.name}!</h1>
        <button
          onClick={handleLogout}
          style={{
            padding: '8px 15px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Выйти
        </button>
      </div>
      
      {editingProfile ? (
        <div style={{ 
          border: '1px solid #ddd', 
          padding: '20px', 
          borderRadius: '8px', 
          backgroundColor: '#f9f9f9',
          marginBottom: '20px'
        }}>
          <h3>Редактирование профиля</h3>
          <div style={{ marginBottom: '10px' }}>
            <span>Имя: </span>
            <input
              type="text"
              value={updateData.name || ''}
              onChange={(e) => setUpdateData({...updateData, name: e.target.value})}
              style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <span>Email: </span>
            <input
              type="email"
              value={updateData.mail || ''}
              onChange={(e) => setUpdateData({...updateData, mail: e.target.value})}
              style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <span><b>Роль:</b> {user.role}</span>
            
          </div>
          <button
            onClick={updateProfile}
            style={{
              padding: '8px 15px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Сохранить
          </button>
          <button
            onClick={cancelEdit}
            style={{
              padding: '8px 15px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Отмена
          </button>
        </div>
      ) : (
        <div style={{ marginBottom: '20px' }}>
          <p><b>Email:</b> {user.mail}</p>
          <p><b>Роль:</b> {user.role}</p>
          <button
            onClick={startProfileEdit}
            style={{
              padding: '8px 15px',
              backgroundColor: '#17a2b8',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            Редактировать профиль
          </button>
        </div>
      )}

      {isAdmin && (
        <div style={{ marginTop: '30px' }}>
          <h2>Панель администратора</h2>
          <button 
            onClick={fetchAllUsers}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
          >
            {showAllUsers ? 'Обновить список пользователей' : 'Показать всех пользователей'}
          </button>

          {showAllUsers && (
            <div>
              <h3>Все пользователи:</h3>
              <div style={{ display: 'grid', gap: '15px' }}>
                {allUsers.map(u => (
                  <div 
                    key={u.id} 
                    style={{
                      border: '1px solid #ddd',
                      padding: '15px',
                      borderRadius: '8px',
                      backgroundColor: '#f9f9f9'
                    }}
                  >
                    {editingUser?.id === u.id ? (
                      <div>
                        <div style={{ marginBottom: '10px' }}>
                          <span>Имя: </span>
                          <input
                            type="text"
                            value={updateData.name || ''}
                            onChange={(e) => setUpdateData({...updateData, name: e.target.value})}
                            style={{ marginLeft: '10px', padding: '5px' }}
                          />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                          <span>Email: </span>
                          <input
                            type="email"
                            value={updateData.mail || ''}
                            onChange={(e) => setUpdateData({...updateData, mail: e.target.value})}
                            style={{ marginLeft: '10px', padding: '5px' }}
                          />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                          <span>Роль: </span>
                          <select
                            value={updateData.role || ''}
                            onChange={(e) => setUpdateData({...updateData, role: e.target.value})}
                            style={{ marginLeft: '10px', padding: '5px' }}
                          >
                            <option value="USER">USER</option>
                            <option value="ADMIN">ADMIN</option>
                            <option value="MANAGER">MANAGER</option>
                          </select>
                        </div>
                        <button
                          onClick={() => editingUser && updateUser(editingUser.id, updateData)}
                          style={{
                            padding: '8px 15px',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            marginRight: '10px'
                          }}
                        >
                          Сохранить
                        </button>
                        <button
                          onClick={cancelEdit}
                          style={{
                            padding: '8px 15px',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Отмена
                        </button>
                      </div>
                    ) : (
                      <>
                        <p><b>ID:</b> {u.id}</p>
                        <p><b>Имя:</b> {u.name}</p>
                        <p><b>Email:</b> {u.mail}</p>
                        <p><b>Роль:</b> {u.role}</p>
                        <div style={{ marginTop: '10px' }}>
                          <button
                            onClick={() => startEdit(u)}
                            style={{
                              padding: '8px 15px',
                              backgroundColor: '#ffc107',
                              color: 'black',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              marginRight: '10px'
                            }}
                          >
                            Редактировать
                          </button>
                          {u.id !== user.id && (
                            <button
                              onClick={() => deleteUser(u.id)}
                              style={{
                                padding: '8px 15px',
                                backgroundColor: '#dc3545',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                            >
                              Удалить
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;