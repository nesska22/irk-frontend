import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        alert("Wylogowano pomyślnie!");
        navigate('/login');
    };

    const handleGoToCourses = () => {
        navigate('/courses');
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
            <h2>Witaj w panelu kandydata! 🎉</h2>
            <p>Udało Ci się pomyślnie zalogować do systemu IRK.</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '30px' }}>
                <button
                    onClick={handleGoToCourses}
                    style={{
                        padding: '12px 20px',
                        backgroundColor: '#1890ff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '500'
                    }}
                >
                    Zmień/Wybierz kierunki studiów
                </button>

                <button 
                    onClick={handleLogout} 
                    style={{
                        padding: '10px 20px',
                        backgroundColor: 'transparent',
                        color: '#ff4d4f',
                        border: '1px solid #ff4d4f',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontSize: '14px'
                    }}
                >
                    Wyloguj się
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
