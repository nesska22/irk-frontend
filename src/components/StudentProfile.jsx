import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function StudentProfile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [results, setResults] = useState(null);
    const [myApplications, setMyApplications] = useState([]);
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
                        setMyApplications(await appRes.json());
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

    if (!user || loading) return <div style={{ textAlign: 'center', padding: '20px' }}>Ładowanie profilu...</div>;

    // STYLE
    const containerStyle = {
        maxWidth: '1200px',
        width: '95%',
        margin: '40px auto',
        padding: '0 20px',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    };

    const headerStyle = {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '10px',
        borderBottom: '1px solid #e8e8e8'
    };

    const sectionStyle = {
        backgroundColor: '#fff',
        padding: '30px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        marginBottom: '30px',
        border: '1px solid #f0f0f0'
    };

    const buttonStyle = {
        padding: '8px 15px',
        backgroundColor: 'transparent',
        color: '#ff4d4f',
        border: '1px solid #ff4d4f',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '14px',
        fontWeight: '600',
        width: 'auto'
    };

    return (
        <div style={containerStyle}>
            {/* Header */}
            <div style={headerStyle}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            background: 'none',
                            border: '2px solid #1890ff',
                            fontSize: '18px',
                            cursor: 'pointer',
                            color: '#1890ff',
                            padding: '6px 12px',
                            transition: 'all 0.3s ease',
                            borderRadius: '6px',
                            fontWeight: 'bold'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#1890ff';
                            e.target.style.color = '#fff';
                            e.target.style.transform = 'scale(1.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'none';
                            e.target.style.color = '#1890ff';
                            e.target.style.transform = 'scale(1)';
                        }}
                        title="Wróć do dashboardu"
                    >
                        Powrót
                    </button>
                    <div style={{
                        width: '4px',
                        height: '24px',
                        backgroundColor: '#1890ff',
                        borderRadius: '2px'
                    }}></div>
                    <h1 style={{
                        fontSize: '24px',
                        fontWeight: '600',
                        color: '#434343',
                        margin: 0,
                        letterSpacing: '-0.5px'
                    }}>
                        Mój Profil
                    </h1>
                </div>
                <button onClick={handleLogout} style={buttonStyle}>
                    Wyloguj się
                </button>
            </div>

            {/* SEKCJA 1: DANE OSOBOWE */}
            <div style={sectionStyle}>
                <h2 style={{ color: '#1890ff', marginTop: 0 }}>📋 Dane Osobowe</h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '20px'
                }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '5px', textTransform: 'uppercase' }}>Imię</label>
                        <p style={{ fontSize: '16px', fontWeight: '600', margin: '0', color: '#333' }}>{user.firstName}</p>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '5px', textTransform: 'uppercase' }}>Nazwisko</label>
                        <p style={{ fontSize: '16px', fontWeight: '600', margin: '0', color: '#333' }}>{user.lastName}</p>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '12px', color: '#999', marginBottom: '5px', textTransform: 'uppercase' }}>Email</label>
                        <p style={{ fontSize: '16px', fontWeight: '600', margin: '0', color: '#333' }}>{user.email}</p>
                    </div>

                </div>
            </div>

            {/* SEKCJA 2: MOJE ZGŁOSZENIA */}
            <div style={sectionStyle}>
                <h2 style={{ color: '#1890ff', marginTop: 0 }}>📝 Moje Zgłoszenia</h2>
                {myApplications.length === 0 ? (
                    <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>Nie złożyłeś jeszcze żadnej aplikacji.</p>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            backgroundColor: '#fff',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}>
                            <thead>
                                <tr style={{ borderBottom: '2px solid #ddd', backgroundColor: '#fafafa', textAlign: 'left' }}>
                                    <th style={{ padding: '12px 15px', fontWeight: '600', color: '#333' }}>ID</th>
                                    <th style={{ padding: '12px 15px', fontWeight: '600', color: '#333' }}>Rekrutacja</th>
                                    <th style={{ padding: '12px 15px', fontWeight: '600', color: '#333' }}>Data Złożenia</th>
                                    {/* NOWA KOLUMNA */}
                                    <th style={{ padding: '12px 15px', fontWeight: '600', color: '#333', textAlign: 'center' }}>Punkty</th>
                                    <th style={{ padding: '12px 15px', fontWeight: '600', color: '#333' }}>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {myApplications.map(app => (
                                    <tr key={app.id} style={{ borderBottom: '1px solid #eee', transition: 'background-color 0.2s' }}>
                                        <td style={{ padding: '12px 15px', fontWeight: 'bold', color: '#555' }}>#{app.id}</td>
                                        <td style={{ padding: '12px 15px', color: '#333' }}>{app.recruitment?.name || 'N/A'}</td>
                                        <td style={{ padding: '12px 15px', fontSize: '14px', color: '#777' }}>
                                            {new Date(app.createdAt).toLocaleString('pl-PL')}
                                        </td>
                                        {/* NOWE POLE */}
                                        <td style={{ padding: '12px 15px', textAlign: 'center', fontWeight: 'bold', color: '#1890ff', fontSize: '15px' }}>
                                            {app.points !== null ? app.points : '0'} pkt
                                        </td>
                                        <td style={{ padding: '12px 15px' }}>
                                            <span style={{
                                                backgroundColor: '#e6f7ff',
                                                color: '#1890ff',
                                                padding: '4px 12px',
                                                borderRadius: '4px',
                                                fontSize: '12px',
                                                fontWeight: 'bold'
                                            }}>
                                                {app.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* SEKCJA 3: MOJE WYNIKI EGZAMINÓW */}
            <div style={sectionStyle}>
                <h2 style={{ color: '#1890ff', marginTop: 0 }}>📊 Moje Wyniki Egzaminów</h2>
                {results ? (
                    <div>
                        {/* MATURA PODSTAWOWA */}
                        {results.mandatory && (
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ color: '#52c41a', borderBottom: '2px solid #52c41a', paddingBottom: '10px' }}>Matura Podstawowa</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
                                    {Object.entries(results.mandatory).map(([subject, score]) => (
                                        <div key={subject} style={{
                                            backgroundColor: '#f5f5f5',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            border: '1px solid #eee'
                                        }}>
                                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>{subject}</p>
                                            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>{score}%</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* MATURA ROZSZERZONA */}
                        {results.extended && results.extended.length > 0 && (
                            <div style={{ marginBottom: '30px' }}>
                                <h3 style={{ color: '#1890ff', borderBottom: '2px solid #1890ff', paddingBottom: '10px' }}>Matura Rozszerzona</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '15px' }}>
                                    {results.extended.map((item, index) => (
                                        <div key={index} style={{
                                            backgroundColor: '#f5f5f5',
                                            padding: '15px',
                                            borderRadius: '8px',
                                            border: '1px solid #eee'
                                        }}>
                                            <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: '#999', textTransform: 'uppercase' }}>{item.subject}</p>
                                            <p style={{ margin: '0', fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>{item.value}%</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* OCENY ZE ŚWIADECTWA */}
                        {results.grades && results.grades.length > 0 && (
                            <div>
                                <h3 style={{ color: '#faad14', borderBottom: '2px solid #faad14', paddingBottom: '10px' }}>Oceny ze Świadectwa</h3>
                                <div style={{ marginTop: '15px' }}>
                                    {results.grades.map((item, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '10px 15px',
                                            borderBottom: '1px solid #eee',
                                            backgroundColor: index % 2 === 0 ? '#fafafa' : '#fff'
                                        }}>
                                            <span style={{ fontWeight: '500', color: '#333' }}>{item.subject}</span>
                                            <span style={{
                                                backgroundColor: '#fff7e6',
                                                color: '#faad14',
                                                padding: '4px 12px',
                                                borderRadius: '4px',
                                                fontWeight: 'bold',
                                                fontSize: '14px'
                                            }}>
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>Nie uzupełniłeś jeszcze wyników egzaminów.</p>
                )}
            </div>
        </div>
    );
}

export default StudentProfile;