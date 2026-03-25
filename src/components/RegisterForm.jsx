import {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm(){
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        passwordHash: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Wysyłanie danych do Springa...", formData);

        try {
            const response = await fetch('http://localhost:8081/api/candidates/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok){
                const savedCandidate = await response.json();
                console.log("Zapisano dane kandydata w bazie", savedCandidate);
            } else {
                console.error("Odrzucono. kod błędu:", response.status);
        }
    } catch (error){
        console.error("Błąd połączenia ze springiem", error);
    }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>Imię:</label>
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />

            <label>Nazwisko:</label>
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />

            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />

            <label>Numer telefonu:</label>
            <input type="number" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />

            <label>Hasło:</label>
            <input type="password" name="passwordHash" value={formData.passwordHash} onChange={handleChange} required />

            <button type="submit">Zarejestruj się</button>
            <button type='button' onClick={()=> navigate('/login')} className="link-button">Masz już konto? Zaloguj się</button>
        </form>
    );
}

export default RegisterForm;