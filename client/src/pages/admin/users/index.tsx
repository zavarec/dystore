import React, { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/layout/admin-layout';
import { withAdmin } from '@/features/auth/with-admin';
import { apiClient } from '@/services/api';
import { UserRole, UserRoleLabelsMap } from '@/types/models/user.model';

interface SimpleUser {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  role: UserRole;
  createdAt: string;
}

const UsersPage: React.FC = () => {
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadUsers() {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get<SimpleUser[]>('/users');
      setUsers(res.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'Ошибка загрузки');
    } finally {
      setLoading(false);
    }
  }

  async function updateRole(id: string, role: UserRole) {
    try {
      await apiClient.patch(`/users/${id}`, { role });
      await loadUsers();
    } catch (e: any) {
      alert(e?.response?.data?.message || 'Ошибка обновления роли');
    }
  }

  useEffect(() => {
    void loadUsers();
  }, []);

  const emailOrPhone = users[0]?.email ? 'Email' : 'Телефон';

  return (
    <AdminLayout title="Пользователи">
      <div style={{ padding: 24 }}>
        <h1>Пользователи</h1>
        {loading && <p>Загрузка...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8 }}>{emailOrPhone}</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Имя</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Роль</th>
                <th style={{ textAlign: 'left', padding: 8 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: 8 }}>{user.email || user.phone || '-'}</td>
                  <td style={{ padding: 8 }}>{user.name || '-'}</td>
                  <td style={{ padding: 8 }}>{UserRoleLabelsMap[user.role]}</td>

                  {user.role !== UserRole.DIRECTOR && (
                    <td style={{ padding: 8, display: 'flex', gap: 8 }}>
                      <button onClick={() => updateRole(user.id, UserRole.MANAGER)}>
                        Назначить MANAGER
                      </button>
                      <button onClick={() => updateRole(user.id, UserRole.CUSTOMER)}>
                        Назначить CUSTOMER
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default withAdmin(UsersPage);
