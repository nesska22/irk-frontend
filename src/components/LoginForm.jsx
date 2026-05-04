import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // TO JEST TA BRAKUJĄCA FUNKCJA:
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:8081/api/admins/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // Jeśli sukces, lecisz do dashboardu
        navigate('/admin-dashboard');
      } else {
        const msg = await response.text();
        setError(msg || 'Błędny e-mail lub hasło');
      }
    } catch (err) {
      setError('Błąd połączenia z serwerem. Czy backend działa?');
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <h2>System IRK</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Logowanie Administratora</p>
        
        {error && <div style={{ color: '#ff4d4f', marginBottom: '15px', fontWeight: '500' }}>{error}</div>}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-input-group">
            <label>Email:</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@admin.com" 
              required 
            />
          </div>

          <div className="auth-input-group">
            <label>Hasło:</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              required 
            />
          </div>

          <button type="submit" className="auth-btn-submit">
            Zaloguj się
          </button>
        </form>

        <div className="auth-footer">
          Problem z dostępem? <button type="button">Kontakt z IT</button>
        </div>
      </div>
    </div>
  );
}

export default LoginForm;