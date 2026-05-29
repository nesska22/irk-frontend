import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('currentUser');
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8081/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error("Błąd podczas zamykania sesji w backendzie:", error);
        }
        localStorage.removeItem('currentUser');
        navigate('/login', { replace: true });
    };

    if (!user) return null;

    return (
        <div className="dashboard-container">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-title-group">
                    <div className="header-decorator"></div>
                    <h1 className="header-title">Panel Rekrutacyjny</h1>
                </div>
                <button onClick={handleLogout} className="btn-dashboard btn-logout">
                    Wyloguj się
                </button>
            </div>

            {/* Powitanie */}
            <div className="welcome-card">
                <h2>Witaj, {user.firstName + ' ' + user.lastName}! 🎉</h2>
                <p>Jesteś zalogowany jako kandydat. Zarządzaj swoją rekrutacją poniżej.</p>
            </div>

            {/* Sekcje Akcji */}
            <div className="actions-grid">
                {/* KARTA 1 */}
                <div className="action-card">
                    <div>
                        <div className="action-card-icon">🎓</div>
                        <h3>Aktualne Nabory</h3>
                        <p>Wybierz interesujące Cię kierunki i złóż na nie aplikacje.</p>
                    </div>
                    <button onClick={() => navigate('/recruitments')} className="btn-dashboard btn-primary">
                        Przejdź do rekrutacji
                    </button>
                </div>

                {/* KARTA 2 */}
                <div className="action-card">
                    <div>
                        <div className="action-card-icon">📊</div>
                        <h3>Wyniki Egzaminów</h3>
                        <p>Uzupełnij wyniki matur oraz oceny ze świadectwa.</p>
                    </div>
                    <button onClick={() => navigate('/results')} className="btn-dashboard btn-primary">
                        Uzupełnij wyniki
                    </button>
                </div>

                {/* KARTA 3 */}
                <div className="action-card">
                    <div>
                        <div className="action-card-icon">👤</div>
                        <h3>Profil Kandydata</h3>
                        <p>Sprawdź swoje dane osobowe i status dokumentów.</p>
                    </div>
                    <button onClick={() => navigate('/profile')} className="btn-dashboard btn-primary">
                        Mój profil
                    </button>
                </div>
            </div>

            <div style={{ marginTop: '50px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
                <p>W razie problemów z rekrutacją skontaktuj się z biurem obsługi kandydata.</p>
            </div>
        </div>
    );
}

export default Dashboard;