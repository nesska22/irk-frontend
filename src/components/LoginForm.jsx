import { useState } from "react";

import { useNavigate } from "react-router-dom";

function LoginForm(){
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

        console.log("Próba logowania...", loginData);

        try {
            const response = await fetch('http://localhost:8081/api/candidates/login', {
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(loginData)
            });

            if(response.ok){
                const user = await response.json();
                alert(`Witaj z powrotem, ${user.firstName}!`);
                navigate('/dashboard');
            } else {
                alert("Błędny email lub hasło!");
            }
        } catch (error) {
            console.error("Błąd połączenia z serwerem:", error);
        }
    };

    return (
<div style={{ padding: '20px' }}>
            <h2>Logowanie</h2>
            {/* Podpinamy naszą funkcję wysyłającą pod cały formularz */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '10px' }}>
                
                <label>Email:</label>
                {/* Atrybut 'name' musi się nazywać DOKŁADNIE TAK SAMO jak pole w naszym useState (loginData) */}
                <input type="email" name="email" value={loginData.email} onChange={handleChange} required />

                <label>Hasło:</label>
                <input type="password" name="password" value={loginData.password} onChange={handleChange} required />

                <button type="submit" style={{ marginTop: '10px', padding: '10px' }}>Zaloguj się</button>
                
                {/* Zwykły przycisk (type="button"), który nie wysyła formularza, tylko używa kierownicy do zmiany strony */}
                <button type="button" onClick={() => navigate('/register')} style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer' }}>
                    Nie masz konta? Zarejestruj się
                </button>
                
            </form>
        </div>
    );
}

export default LoginForm;