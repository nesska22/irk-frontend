import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [results, setResults] = useState(null);
    const [myApplications, setMyApplications] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('currentUser');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                navigate('/login');
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            try {
                const appRes = await fetch('http://localhost:8081/api/applications/my', {
                    credentials: 'include'
                });

                if (appRes.ok) {
                    const appsData = await appRes.json();
                    setMyApplications(appsData);

                    if (appsData.length > 0 && appsData[0].documents) {
                        setDocuments(appsData[0].documents);
                    }
                }

                const resultsRes = await fetch('http://localhost:8081/api/results/my', {
                    credentials: 'include'
                });
                if (resultsRes.ok) {
                    setResults(await resultsRes.json());
                }

            } catch (err) {
                console.error("Błąd pobierania danych", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user]);

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
        navigate('/login', { replace: true });
    };

    if (!user || loading) return <div className="profile-loading">Ładowanie profilu...</div>;

    return (
        <div className="profile-container">
            {/* Header */}
            <div className="profile-header">
                <div className="profile-header-left">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="profile-back-button"
                        title="Wróć do dashboardu"
                    >
                        Powrót
                    </button>
                    <div className="profile-header-decorator"></div>
                    <h1 className="profile-header-title">Mój Profil</h1>
                </div>
                <button onClick={handleLogout} className="profile-logout-button">
                    Wyloguj się
                </button>
            </div>

            <div className="profile-grid">

                {/* SEKCJA 1: DANE OSOBOWE */}
                <div className="profile-section">
                    <h2 className="section-title text-blue">📋 Dane Osobowe</h2>
                    <div className="personal-data-box">
                        <div className="data-group">
                            <label>Imię</label>
                            <p>{user.firstName}</p>
                        </div>
                        <div className="data-group">
                            <label>Nazwisko</label>
                            <p>{user.lastName}</p>
                        </div>
                        <div className="data-group full-width">
                            <label>Email</label>
                            <p>{user.email}</p>
                        </div>
                    </div>
                </div>

                {/* SEKCJA 2: MOJE ZGŁOSZENIA (Zintegrowana i Naprawiona) */}
                <div className="profile-section">
                    <h2 className="section-title text-blue">📝 Moje Zgłoszenia</h2>
                    {myApplications.length === 0 ? (
                        <p className="empty-message">Nie złożyłeś jeszcze żadnej aplikacji.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="profile-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Rekrutacja</th>
                                        <th>Data Złożenia</th>
                                        <th style={{ textAlign: 'center' }}>Punkty</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myApplications.map(app => (
                                        <tr key={app.id}>
                                            <td className="text-bold">#{app.id}</td>
                                            <td>{app.recruitment?.name || 'N/A'}</td>
                                            <td className="text-muted">
                                                {new Date(app.createdAt).toLocaleString('pl-PL')}
                                            </td>
                                            <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#1890ff' }}>
                                                {app.points !== null ? app.points : '0'} pkt
                                            </td>
                                            <td>
                                                <span className="badge-status">{app.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* SEKCJA 3: MOJE WYNIKI EGZAMINÓW */}
                <div className="profile-section">
                    <h2 className="section-title text-blue">📊 Moje Wyniki</h2>
                    {results ? (
                        <div className="exam-results-wrapper">
                            {/* MATURA PODSTAWOWA */}
                            {results.mandatory && (
                                <div className="exam-block">
                                    <h3 className="exam-sub-title border-green">Matura Podstawowa</h3>
                                    <div className="scores-grid">
                                        {Object.entries(results.mandatory).map(([subject, score]) => (
                                            <div key={subject} className="score-card">
                                                <span className="score-label">{subject}</span>
                                                <span className="score-value text-green">{score}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* MATURA ROZSZERZONA */}
                            {results.extended && results.extended.length > 0 && (
                                <div className="exam-block">
                                    <h3 className="exam-sub-title border-blue">Matura Rozszerzona</h3>
                                    <div className="scores-grid">
                                        {results.extended.map((item, index) => (
                                            <div key={index} className="score-card">
                                                <span className="score-label">{item.subject}</span>
                                                <span className="score-value text-blue">{item.value}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* OCENY ZE ŚWIADECTWA */}
                            {results.grades && results.grades.length > 0 && (
                                <div className="exam-block">
                                    <h3 className="exam-sub-title border-orange">Oceny ze Świadectwa</h3>
                                    <div className="grades-list">
                                        {results.grades.map((item, index) => (
                                            <div key={index} className="grade-item">
                                                <span className="grade-subject">{item.subject}</span>
                                                <span className="badge-grade">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="empty-message">Nie uzupełniłeś jeszcze wyników egzaminów.</p>
                    )}
                </div>

                {/* SEKCJA 4: MOJE DOKUMENTY */}
                <div className="profile-section">
                    <h2 className="section-title text-blue">📂 Moje Dokumenty</h2>
                    {documents.length === 0 ? (
                        <p className="empty-message">Brak przypisanych dokumentów.</p>
                    ) : (
                        <div className="table-responsive">
                            <table className="profile-table">
                                <thead>
                                    <tr>
                                        <th>Typ dokumentu</th>
                                        <th style={{ textAlign: 'center' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents.map(doc => (
                                        <tr key={doc.id}>
                                            <td style={{ fontWeight: '500', color: '#333' }}>{doc.name}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <span className={`badge-status ${doc.status === 'Dostarczone' ? 'status-delivered' : 'status-missing'}`}>
                                                    {doc.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

export default StudentProfile;