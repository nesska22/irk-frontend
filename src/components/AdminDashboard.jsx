import React from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
    const navigate = useNavigate();
    // Pobieramy admina z pamięci
    const adminString = localStorage.getItem('currentUser');
    const admin = adminString ? JSON.parse(adminString) : null;

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/admin/login');
    };

    return (
        <div style={{ padding: '20px', border: '2px solid red' }}>
            <h2 style={{ color: 'red' }}>Tajny Panel Administratora</h2>
            {admin && admin.role === 'ADMIN' ? (
                <div>
                    <p>Zalogowano jako: <strong>{admin.email}</strong></p>
                    <p>Tutaj w przyszłości będzie lista wszystkich rekrutacji.</p>
                    <button onClick={handleLogout} style={{ backgroundColor: 'red', color: 'white' }}>Wyloguj Admina</button>
                </div>
            ) : (
                <p>Brak uprawnień! <button onClick={() => navigate('/admin/login')}>Zaloguj</button></p>
            )}
        </div>
    );
}

export default AdminDashboard;