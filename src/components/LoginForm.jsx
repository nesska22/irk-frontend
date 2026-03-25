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
        <div>
            <h2>Logowanie</h2>
            <form onSubmit={handleSubmit}>
                
                <label>Email:</label>
                <input type="email" name="email" value={loginData.email} onChange={handleChange} required />

                <label>Hasło:</label>
                <input type="password" name="password" value={loginData.password} onChange={handleChange} required />

                <button type="submit">Zaloguj się</button>     
                <button type="button" onClick={() => navigate('/register')} className="link-button">
                    Nie masz konta? Zarejestruj się
                </button>
            </form>
        </div>
    );
}

export default LoginForm;