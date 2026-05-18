import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function AdminDashboard() {
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);

                if (parsedUser.role === 'ADMIN') {
                    setAdmin(parsedUser);
                } else {
                    navigate('/admin/login');
                }
            } catch (e) {
                localStorage.removeItem('currentUser');
                navigate('/admin/login');
            }
        } else {
            navigate('/admin/login');
        }
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await fetch('http://localhost:8081/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error("Błąd podczas wylogowania:", error);
        }

        localStorage.removeItem('currentUser');
        navigate('/admin/login', { replace: true });
    };

    if (!admin) return null;

    return (
        <div className="admin-dashboard-container">

            {/* HEADER */}
            <div className="admin-header">
                <div className="admin-header-group">
                    <div className="admin-header-bar"></div>
                    <h1 className="admin-header-title">
                        Panel Administratora
                    </h1>
                </div>

                <button
                    onClick={handleLogout}
                    className="admin-btn-logout"
                >
                    Wyloguj się
                </button>
            </div>

            {/* POWITANIE */}
            <div className="admin-welcome-card">
                <h2>
                    Witaj, {admin.firstName + ' ' + admin.lastName}! 🎉
                </h2>

                <p>
                    Jesteś zalogowany jako administrator. Zarządzaj systemem poniżej.
                </p>
            </div>

            {/* GRID KART */}
            <div className="admin-grid">

                {/* KARTA 1 */}
                <div className="admin-card">
                    <div>
                        <div className="admin-card-icon">📚</div>

                        <h3>Zarządzanie Kierunkami</h3>

                        <p>
                            Edytuj ofertę edukacyjną i dostępne kierunki.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/admin/courses')}
                        className="admin-btn-primary"
                    >
                        Przejdź do kierunków
                    </button>
                </div>

                {/* KARTA 2 */}
                <div className="admin-card">
                    <div>
                        <div className="admin-card-icon">👥</div>

                        <h3>Zarządzanie Kandydatami</h3>

                        <p>
                            Przeglądaj i zarządzaj kandydatami oraz ich zgłoszeniami.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/admin/recruitments-list')}
                        className="admin-btn-primary"
                    >
                        Zarządzaj kandydatami
                    </button>
                </div>

                {/* KARTA 3 */}
                <div className="admin-card">
                    <div>
                        <div className="admin-card-icon">🖥️</div>

                        <h3>Zarządzanie Rekrutacją</h3>

                        <p>
                            Twórz rekrutację na dany kierunek.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate('/admin/recruitments')}
                        className="admin-btn-primary"
                    >
                        Zarządzaj rekrutacjami
                    </button>
                </div>

            </div>

            {/* FOOTER */}
            <div style={{
                marginTop: '50px',
                textAlign: 'center',
                color: '#999',
                fontSize: '14px'
            }}>
                <p>W razie problemów skontaktuj się z działem IT.</p>
            </div>

        </div>
    );
}

export default AdminDashboard;