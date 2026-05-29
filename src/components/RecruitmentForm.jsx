import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function RecruitmentForm() {
    const navigate = useNavigate();
    const [activeRecruitments, setActiveRecruitments] = useState([]);
    const [myApplications, setMyApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const RECRUITMENTS_URL = 'http://localhost:8081/api/recruitments/active';
    const APPLICATIONS_URL = 'http://localhost:8081/api/applications';

    const fetchData = async () => {
        try {
            const [recRes, appRes] = await Promise.all([
                fetch(RECRUITMENTS_URL, { credentials: 'include' }),
                fetch(`${APPLICATIONS_URL}/my`, { credentials: 'include' })
            ]);

            if (recRes.ok && appRes.ok) {
                setActiveRecruitments(await recRes.json());
                setMyApplications(await appRes.json());
            }
        } catch (err) {
            console.error("Błąd pobierania danych", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleApply = async (recruitmentId) => {
        if (!window.confirm("Czy na pewno chcesz złożyć aplikację na ten nabór?")) return;

        try {
            const response = await fetch(`${APPLICATIONS_URL}/${recruitmentId}`, {
                method: 'POST',
                credentials: 'include'
            });

            if (response.ok) {
                alert("Aplikacja została złożona pomyślnie!");
                fetchData(); // Odświeżamy dane po aplikacji
            } else if (response.status === 409) {
                const errorMsg = await response.text();
                alert(errorMsg); // "Już złożyłeś aplikację..."
            } else {
                alert("Wystąpił błąd podczas składania aplikacji.");
            }
        } catch (err) {
            alert("Błąd połączenia z serwerem.");
        }
    };

    // Funkcja sprawdzająca, czy kandydat już ma aplikację na dany nabór
    const hasApplied = (recruitmentId) => {
        return myApplications.some(app => app.recruitment.id === recruitmentId);
    };

    if (loading) return <div>Ładowanie dostępnych rekrutacji...</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '30px',
                width: '100%'
            }}>
                <div style={{ flex: '1', textAlign: 'left' }}>
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="profile-back-button"
                        title="Wróć do dashboardu"
                    >
                        Powrót
                    </button>
                </div>
                <div style={{ flex: '2', textAlign: 'center' }}>
                    <h2 style={{ margin: 0, fontSize: '24px', color: '#333' }}>Wybór Rekrutacji</h2>
                </div>
                <div style={{ flex: '1' }}></div>
            </div>
            <p style={{ color: '#555', marginBottom: '30px' }}>
                Poniżej znajduje się lista aktywnych naborów. Wybierz ten, który Cię interesuje i złóż aplikację.
            </p>

            {/* SEKCJA: AKTYWNE REKRUTACJE */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginBottom: '50px' }}>
                {activeRecruitments.map(rec => {
                    const applied = hasApplied(rec.id);
                    return (
                        <div key={rec.id} style={{
                            backgroundColor: '#fff',
                            border: '1px solid #ddd',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <h3 style={{ marginTop: 0, color: '#1890ff' }}>{rec.name}</h3>
                            <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                                <strong>Od:</strong> {rec.startDate} <br/>
                                <strong>Do:</strong> {rec.endDate}
                            </p>

                            <div style={{ marginTop: 'auto', paddingTop: '20px', textAlign: 'center' }}>
                                {applied ? (
                                    <button disabled style={{ width: '100%', padding: '10px', backgroundColor: '#f5f5f5', color: '#a8a8a8', border: '1px solid #d9d9d9', borderRadius: '4px', cursor: 'not-allowed', fontWeight: 'bold' }}>
                                        ✓ Aplikacja złożona
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleApply(rec.id)}
                                        style={{ width: '100%', padding: '10px', backgroundColor: '#52c41a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                                    >
                                        Złóż aplikację
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
                {activeRecruitments.length === 0 && (
                    <p style={{ color: '#999' }}>Brak aktywnych rekrutacji w tym momencie.</p>
                )}
            </div>


        </div>
    );
}

export default RecruitmentForm;