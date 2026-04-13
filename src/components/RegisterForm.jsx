import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        passwordHash: ''
    });

    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Wysyłanie danych do Springa...", formData);

        setMessage('');

        try {
            const response = await fetch('http://localhost:8081/api/candidates/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok || response.status === 201) {
                const savedCandidate = await response.json();
                console.log("Zapisano dane kandydata w bazie", savedCandidate);

                setIsError(false);
                setMessage("Zarejestrowano pomyślnie! Możesz się teraz zalogować.");

                setFormData({ firstName: '', lastName: '', email: '', phoneNumber: '', passwordHash: '' });

            } else if (response.status === 409) {
                setIsError(true);
                setMessage("Rejestracja nieudana - podany adres email jest już zajęty.");
            } else {
                console.error("Odrzucono. kod błędu:", response.status);
                setIsError(true);
                setMessage("Wystąpił błąd serwera. Spróbuj ponownie później.");
            }
        } catch (error) {
            console.error("Błąd połączenia ze springiem", error);
            setIsError(true);
            setMessage("Brak połączenia z serwerem. Upewnij się, że backend działa.");
        }
    };

    return (
        <div>
            <h2>Rejestracja Kandydata</h2>

            {message && (
                <div style={{
                    padding: '10px',
                    marginBottom: '15px',
                    color: 'white',
                    backgroundColor: isError ? '#dc3545' : '#28a745',
                    borderRadius: '5px',
                    textAlign: 'center',
                    fontWeight: 'bold'
                }}>
                    {message}
                </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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

                <button type="submit" style={{ marginTop: '10px' }}>Zarejestruj się</button>
                <button type='button' onClick={() => navigate('/login')} className="link-button">Masz już konto? Zaloguj się</button>
            </form>
        </div>
    );
}

export default RegisterForm;