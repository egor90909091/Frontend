import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

import { API_URL } from "../config";


export function PrivateRoute({ children }: { children: React.ReactElement }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setAuthorized(false);
        return;
      }

      try {
        const res = await fetch(`${API_URL}/api/auth/check`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          setAuthorized(true);
        } else if (res.status === 401) {
          const refreshToken = localStorage.getItem('refreshToken');
          if (!refreshToken) {
            setAuthorized(false);
            return;
          }

          const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem('accessToken', data.accessToken);
            if (data.refreshToken) {
              localStorage.setItem('refreshToken', data.refreshToken);
            }

            const recheck = await fetch(`${API_URL}/api/auth/check`, {
              method: 'GET',
              headers: {
                Authorization: `Bearer ${data.accessToken}`,
              },
            });

            setAuthorized(recheck.ok);
          } else {
            setAuthorized(false);
          }
        } else {
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
