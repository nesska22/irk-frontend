import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const handleLogout = () => {
        alert("Wylogowano pomyślnie!");
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', maxWidth: '400px', marginTop: '20px' }}>
            <h2>Witaj w panelu kandydata! 🎉</h2>
            <p>Udało Ci się pomyślnie zalogować do systemu IRK.</p>
            
            <div style={{ marginTop: '30px' }}>
                <button 
                    onClick={handleLogout} 
                    style={{ padding: '10px 20px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Wyloguj się
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
