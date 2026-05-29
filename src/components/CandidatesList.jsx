import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function CandidatesList() {
    const navigate = useNavigate();
    const { recruitmentId } = useParams();
    const [applications, setApplications] = useState([]);
    const [recruitmentName, setRecruitmentName] = useState("Ładowanie...");
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState(null);
    const [documents, setDocuments] = useState({});

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await fetch(`http://localhost:8081/api/applications/recruitment/${recruitmentId}`, {
                    credentials: 'include'
                });

                if (response.ok) {
                    const data = await response.json();
                    setApplications(data);

                    const initialDocs = {};
                    data.forEach(app => {
                        initialDocs[app.id] = app.documents || [];
                    });
                    setDocuments(initialDocs);

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

    const handleDocumentStatusChange = async (appId, docId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:8081/api/documents/${docId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: newStatus }),
                credentials: 'include'
            });

            if (response.ok) {
                setDocuments(prev => ({
                    ...prev,
                    [appId]: prev[appId].map(doc => doc.id === docId ? { ...doc, documentStatus: newStatus } : doc)
                }));

                setSelectedApp(prev => {
                    if (!prev || prev.id !== appId) return prev;
                    return { ...prev };
                });

                console.log(`Zapisano status w bazie danych dla dokumentu ID ${docId}`);
            } else {
                alert("Nie udało się zaktualizować statusu dokumentu na serwerze.");
            }
        } catch (err) {
            console.error("Błąd sieci podczas komunikacji z backendem:", err);
            alert("Błąd połączenia z serwerem.");
        }
    };

    const getGeneralDocumentsStatus = (appId) => {
        const docs = documents[appId];
        if (!docs || docs.length === 0) return "Brak";
        const allDelivered = docs.every(doc => doc.documentStatus === "Dostarczone");
        return allDelivered ? "Dostarczone" : "Niedostarczone";
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case "ZAKWALIFIKOWANY": return { backgroundColor: '#f6ffed', color: '#52c41a', border: '1px solid #b7eb8f' };
            case "LISTA REZERWOWA": return { backgroundColor: '#fff7e6', color: '#faad14', border: '1px solid #ffe58f' };
            case "ODRZUCONY": return { backgroundColor: '#fff1f0', color: '#f5222d', border: '1px solid #ffa39e' };
            default: return { backgroundColor: '#e6f7ff', color: '#1890ff', border: '1px solid #91d5ff' };
        }
    };

    const getDocStatusStyle = (status) => {
        return status === "Dostarczone"
            ? { backgroundColor: '#f6ffed', color: '#52c41a', border: '1px solid #b7eb8f' }
            : { backgroundColor: '#fff1f0', color: '#ff4d4f', border: '1px solid #ffa39e' };
    };

    if (loading) return <div>Ładowanie kandydatów...</div>;

    return (
        <div className="candidates-container" style={{ position: 'relative' }}>
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
                            <th className="col-rank" style={{ width: '60px' }}>Poz.</th>
                            <th>Imię i Nazwisko</th>
                            <th>Email</th>
                            <th className="col-status" style={{ textAlign: 'center' }}>Status</th>
                            <th style={{ textAlign: 'center' }}>Dokumenty</th>
                            <th className="col-actions" style={{ textAlign: 'center' }}>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => {
                            const docStatus = getGeneralDocumentsStatus(app.id);
                            return (
                                <tr key={app.id} className="table-row-hover">
                                    <td className="col-rank" style={{ fontWeight: 'bold', color: '#595959' }}>
                                        #{app.id}
                                    </td>
                                    <td style={{ fontWeight: '500' }}>{app.candidate.firstName} {app.candidate.lastName}</td>
                                    <td style={{ color: '#8c8c8c', fontSize: '13px' }}>{app.candidate.email}</td>
                                    <td className="col-status" style={{ textAlign: 'center' }}>
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
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            ...getDocStatusStyle(docStatus)
                                        }}>
                                            {docStatus === "Dostarczone" ? "✅ Dostarczone" : "❌ Niedostarczone"}
                                        </span>
                                    </td>
                                    <td className="col-actions" style={{ textAlign: 'center' }}>
                                        <button
                                            className="details-button"
                                            onClick={() => setSelectedApp(app)}
                                        >
                                            Szczegóły
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                        {applications.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                                    Brak kandydatów w tej rekrutacji.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            {selectedApp && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 2000
                }}>
                    <div style={{
                        backgroundColor: '#fff', padding: '30px', borderRadius: '12px', width: '90%', maxWidth: '800px',
                        maxHeight: '85vh', overflowY: 'auto', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', boxSizing: 'border-box'
                    }}>
                        {/* Nagłówek modala */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px' }}>
                            <h2 style={{ margin: 0, color: '#333' }}>📋 {selectedApp.id} - {selectedApp.candidate.firstName} {selectedApp.candidate.lastName}</h2>
                            <button
                                onClick={() => setSelectedApp(null)}
                                style={{ border: 'none', background: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}
                            >✕</button>
                        </div>

                        {/* Dane kandydata */}
                        <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '6px', marginBottom: '20px' }}>
                            <p style={{ margin: '5px 0' }}><strong>Imię i nazwisko:</strong> {selectedApp.candidate.firstName} {selectedApp.candidate.lastName}</p>
                            <p style={{ margin: '5px 0' }}><strong>Adres e-mail:</strong> {selectedApp.candidate.email}</p>
                            <p style={{ margin: '5px 0' }}><strong>Status aplikacji:</strong> {selectedApp.status}</p>
                        </div>

                        {/* Siatka z ocenami i wynikami */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '25px' }}>
                            {/* Wyniki Matur */}
                            <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '15px' }}>
                                <h4 style={{ margin: '0 0 10px 0', color: '#52c41a', borderBottom: '1px solid #e8e8e8', paddingBottom: '5px' }}>📊 Wyniki egzaminów</h4>
                                {selectedApp.results?.mandatory ? (
                                    <div>
                                        {Object.entries(selectedApp.results.mandatory).map(([subject, val]) => (
                                            <div key={subject} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '6px 0' }}>
                                                <span>{subject} (Podst.):</span>
                                                <strong style={{ color: '#52c41a' }}>{val}%</strong>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Brak wprowadzonych wyników.</p>
                                )}
                            </div>
                            <div style={{ border: '1px solid #e8e8e8', borderRadius: '8px', padding: '15px' }}>
                                <h4 style={{ margin: '0 0 10px 0', color: '#faad14', borderBottom: '1px solid #e8e8e8', paddingBottom: '5px' }}>🏫 Oceny ze świadectwa</h4>
                                {selectedApp.results?.grades && selectedApp.results.grades.length > 0 ? (
                                    <div style={{ maxHeight: '150px', overflowY: 'auto' }}>
                                        {selectedApp.results.grades.map((item, index) => (
                                            <div key={index} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', margin: '4px 0' }}>
                                                <span>{item.subject}</span>
                                                <strong style={{ color: '#faad14', backgroundColor: '#fffbe6', padding: '2px 6px', borderRadius: '4px' }}>{item.value}</strong>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>Brak wprowadzonych ocen ze świadectwa.</p>
                                )}
                            </div>
                        </div>
                        <div style={{ border: '1px solid #1890ff', borderRadius: '8px', padding: '20px', backgroundColor: '#e6f7ff' }}>
                            <h4 style={{ margin: '0 0 15px 0', color: '#1890ff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                📂 Zarządzanie dokumentami
                            </h4>

                            <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', borderRadius: '6px', overflow: 'hidden' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
                                        <th style={{ padding: '10px', textAlign: 'left', fontSize: '13px' }}>Nazwa dokumentu</th>
                                        <th style={{ padding: '10px', textAlign: 'center', fontSize: '13px', width: '200px' }}>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {documents[selectedApp.id]?.map(doc => (
                                        <tr key={doc.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                            <td style={{ padding: '12px 10px', fontSize: '13px', fontWeight: '500' }}>{doc.documentName}</td>
                                            <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                                                <select
                                                    value={doc.documentStatus}
                                                    onChange={(e) => handleDocumentStatusChange(selectedApp.id, doc.id, e.target.value)}
                                                    style={{
                                                        padding: '6px',
                                                        borderRadius: '4px',
                                                        fontWeight: '600',
                                                        border: '1px solid #d9d9d9',
                                                        backgroundColor: doc.documentStatus === 'Dostarczone' ? '#f6ffed' : '#fff1f0',
                                                        color: doc.documentStatus === 'Dostarczone' ? '#52c41a' : '#ff4d4f',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <option value="Niedostarczone" style={{ backgroundColor: '#fff', color: '#333' }}>❌ Niedostarczone</option>
                                                    <option value="Dostarczone" style={{ backgroundColor: '#fff', color: '#333' }}>✅ Dostarczone</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!documents[selectedApp.id] || documents[selectedApp.id].length === 0) && (
                                        <tr>
                                            <td colSpan="2" style={{ padding: '15px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
                                                Brak przypisanych dokumentów dla tego kandydata.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div style={{ marginTop: '25px', textAlign: 'right' }}>
                            <button
                                onClick={() => setSelectedApp(null)}
                                style={{ padding: '10px 24px', backgroundColor: '#595959', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
                            >
                                Zamknij podgląd
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CandidatesList;