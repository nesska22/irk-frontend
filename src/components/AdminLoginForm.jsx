import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminLoginForm(){
    const navigate = useNavigate();

    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:8081/api/admins/login', {
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(loginData)
            });

            if(response.ok){
                const adminUser = await response.json();

                localStorage.setItem('currentUser', JSON.stringify({ ...adminUser, role: 'ADMIN' }));

                alert(`Zalogowano jako Administrator!`);

                navigate('/admin-dashboard');
            } else {
                alert("Odmowa dostępu! Błędne dane administratora.");
            }
        } catch (error) {
            console.error("Błąd połączenia z serwerem:", error);
        }
    };

    return (
        <div style={{ border: '2px solid red', padding: '20px', borderRadius: '5px' }}>
            <h2 style={{ color: 'red' }}>Logowanie do Panelu Administratora</h2>
            <form onSubmit={handleSubmit}>

                <label>Email pracowniczy:</label>
                <input type="email" name="email" value={loginData.email} onChange={handleChange} required />

                <label>Hasło:</label>
                <input type="password" name="password" value={loginData.password} onChange={handleChange} required />

                <button type="submit" style={{ backgroundColor: 'red', color: 'white' }}>Zaloguj jako Admin</button>
            </form>
        </div>
    );
}

export default AdminLoginForm;