import { Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export function PrivateRoute({ children }: { children: React.ReactElement }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('[PrivateRoute] Токен в localStorage:', localStorage.getItem('accessToken'));

      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('[PrivateRoute] Токен отсутствует');
        setAuthorized(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:3000/auth/check', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          console.log('[PrivateRoute] Авторизация успешна');
          setAuthorized(true);
        } else if (res.status === 401) {
          console.log('[PrivateRoute] Токен невалиден, пробуем refresh');

          // пробуем обновить токен
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            setAuthorized(false);
            return;
          }

          const refreshRes = await fetch('http://localhost:3000/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem('accessToken', data.accessToken);
            if (data.refreshToken) {
              localStorage.setItem('refreshToken', data.refreshToken); // если сервер обновляет
            }

            // повторяем проверку с новым токеном
            const recheck = await fetch('http://localhost:3000/auth/check', {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${data.accessToken}`,
              },
            });

            setAuthorized(recheck.ok);
          } else {
            console.log('[PrivateRoute] Refresh не удался');
            setAuthorized(false);
          }
        } else {
          console.log('[PrivateRoute] Неизвестная ошибка авторизации');
          setAuthorized(false);
        }
      } catch (error) {
        console.error('[PrivateRoute] Ошибка сети:', error);
        setAuthorized(false);
      }
    };

    checkAuth();
  }, []);

  if (authorized === null) return <div>Загрузка...</div>;
  return authorized ? children : <Navigate to="/login" />;
}
