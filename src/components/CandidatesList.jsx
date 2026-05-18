import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function CandidatesList() {
    const navigate = useNavigate();
    // Pobieramy ID rekrutacji z adresu (np. /admin/candidates/3)
    const { recruitmentId } = useParams();

    const [applications, setApplications] = useState([]);
    const [recruitmentName, setRecruitmentName] = useState("Ładowanie...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                // Zapytanie do backendu o aplikacje dla DANEJ rekrutacji
                const response = await fetch(`http://localhost:8081/api/applications/recruitment/${recruitmentId}`, {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setApplications(data);
                    // Pobranie nazwy rekrutacji z pierwszego zgłoszenia (jeśli są)
                    if(data.length > 0 && data[0].recruitment) {
                        setRecruitmentName(data[0].recruitment.name);
                    } else {
                        setRecruitmentName("Wybrana rekrutacja (Brak kandydatów)");
                    }
                } else {
                    console.error("Błąd pobierania kandydatów");
                    setRecruitmentName("Błąd ładowania");
                }
            } catch (err) {
                console.error("Błąd połączenia z serwerem", err);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, [recruitmentId]);

    const getStatusStyle = (status) => {
        // Tu możesz dostosować statusy do swoich z tabeli Application
        switch (status) {
            case "ZAKWALIFIKOWANY": return { backgroundColor: '#f6ffed', color: '#52c41a', border: '1px solid #b7eb8f' };
            case "LISTA REZERWOWA": return { backgroundColor: '#fff7e6', color: '#faad14', border: '1px solid #ffe58f' };
            case "ODRZUCONY": return { backgroundColor: '#fff1f0', color: '#f5222d', border: '1px solid #ffa39e' };
            default: return { backgroundColor: '#e6f7ff', color: '#1890ff', border: '1px solid #91d5ff' }; // np. ZŁOŻONA
        }
    };

    if (loading) return <div>Ładowanie kandydatów...</div>;

    return (
        <div className="candidates-container">
            <div style={{ textAlign: 'left', marginBottom: '15px' }}>
                <button onClick={() => navigate(-1)} className="back-button">
                    Powrót do listy rekrutacji
                </button>
            </div>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '30px',
                paddingBottom: '15px',
                borderBottom: '1px solid #e8e8e8'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '4px', height: '30px', backgroundColor: '#1890ff', borderRadius: '2px' }}></div>
                    <div>
                        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#262626', margin: 0 }}>
                            Kandydaci: <span style={{ color: '#1890ff' }}>{recruitmentName}</span>
                        </h1>
                        <p style={{ margin: 0, color: '#8c8c8c', fontSize: '14px' }}>Liczba chętnych: {applications.length}</p>
                    </div>
                </div>

                <button className="button" style={{
                    backgroundColor: '#0056b3',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }} onClick={() => window.print()}>
                    🖨️ Drukuj listę
                </button>
            </div>
            <div className="candidates-table-card">
                <table className="candidates-table">
                    <thead>
                        <tr>
                            <th className="col-rank">ID</th>
                            <th>Imię i Nazwisko</th>
                            <th>Email</th>
                            <th className="col-status">Status</th>
                            <th className="col-actions">Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.id} className="table-row-hover">
                                <td className="col-rank" style={{ fontWeight: 'bold', color: '#595959' }}>
                                    #{app.id}
                                </td>
                                <td style={{ fontWeight: '500' }}>{app.candidate.firstName} {app.candidate.lastName}</td>
                                <td style={{ color: '#8c8c8c', fontSize: '13px' }}>{app.candidate.email}</td>
                                <td className="col-status">
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '4px 12px',
                                        borderRadius: '20px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        ...getStatusStyle(app.status.toUpperCase())
                                    }}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="col-actions">
                                    <button className="details-button">Szczegóły</button>
                                </td>
                            </tr>
                        ))}
                        {applications.length === 0 && (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                    Brak kandydatów w tej rekrutacji.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default CandidatesList;