import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminRecruitmentManager() {
    const navigate = useNavigate();
    const [recruitments, setRecruitments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    const [formData, setFormData] = useState({
        id: null,
        name: '',
        startDate: '',
        endDate: '',
        isActive: false,
        courseId: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    const RECRUITMENTS_API_URL = 'http://localhost:8081/api/recruitments';
    const COURSES_API_URL = 'http://localhost:8081/api/courses';

    const fetchData = async () => {
        try {
            const [recRes, courRes] = await Promise.all([
                fetch(RECRUITMENTS_API_URL, { credentials: 'include' }),
                fetch(COURSES_API_URL, { credentials: 'include' })
            ]);

            if (recRes.ok && courRes.ok) {
                setRecruitments(await recRes.json());
                setCourses(await courRes.json());
            }
        } catch (err) {
            alert("Błąd pobierania danych: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            alert("Błąd: Data zakończenia nie może być wcześniejsza niż data rozpoczęcia!");
            return;
        }

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${RECRUITMENTS_API_URL}/${formData.id}` : RECRUITMENTS_API_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    name: formData.name,
                    startDate: formData.startDate,
                    endDate: formData.endDate,
                    isActive: formData.isActive,
                    courseId: formData.courseId ? parseInt(formData.courseId) : null
                })
            });

            if (response.ok) {
                fetchData();
                resetForm();
            } else {
                const errorText = await response.text();
                alert("Błąd zapisu: " + errorText);
            }
        } catch (err) {
            alert("Błąd zapisu: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć tę rekrutację?")) return;
        try {
            const response = await fetch(`${RECRUITMENTS_API_URL}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                fetchData();
            }
        } catch (err) {
            alert("Błąd usuwania: " + err.message);
        }
    };

    const resetForm = () => {
        setFormData({ id: null, name: '', startDate: '', endDate: '', isActive: false, courseId: '' });
        setIsEditing(false);
    };

    const startEdit = (rec) => {
        setFormData({
            id: rec.id,
            name: rec.name,
            startDate: rec.startDate,
            endDate: rec.endDate,
            isActive: rec.isActive,
            courseId: rec.course ? rec.course.id : ''
        });
        setIsEditing(true);
    };

    const getAssignedCourseName = (rec) => {
        return rec.course ? rec.course.name : <span style={{ color: '#bfbfbf' }}>Nieprzypisany</span>;
    };

    if (loading) return <div className="admin-page-container">Ładowanie danych...</div>;

    return (
        <div className="admin-page-container">
            <div className="admin-content-card" style={{ maxWidth: '800px', width: '100%' }}>

                {/* Header sekcji */}
                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                    <button onClick={() => navigate('/admin-dashboard')} className="back-button">
                        Powrót do panelu
                    </button>
                    <div className="dashboard-header" style={{ marginBottom: '30px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div className="header-decorator"></div>
                            <h1 className="header-title">Zarządzanie Rekrutacjami</h1>
                        </div>
                    </div>
                    <p style={{ color: '#8c8c8c' }}>Definiuj ramy czasowe i przypisuj je do kierunków studiów.</p>
                </div>

                {/* Formularz w karcie */}
                <div className="admin-form-section">
                    <h3 style={{ marginBottom: '20px', color: '#1890ff' }}>
                        {isEditing ? '📝 Edycja rekrutacji' : '➕ Nowa rekrutacja'}
                    </h3>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '15px' }}>
                            <label>Nazwa rekrutacji</label>
                            <input
                                type="text"
                                placeholder="np. Rekrutacja Letnia 2026"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '20px', marginBottom: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <label>Data rozpoczęcia</label>
                                <input
                                    type="date"
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    required
                                />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label>Data zakończenia</label>
                                <input
                                    type="date"
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <label>Przypisz do kierunku</label>
                            <select
                                value={formData.courseId}
                                onChange={(e) => setFormData({...formData, courseId: e.target.value})}
                                style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
                            >
                                <option value="">-- Wybierz kierunek --</option>
                                {courses.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                                    style={{ width: '18px', height: '18px' }}
                                />
                                <span>Oznacz jako aktywną (widoczna dla kandydatów)</span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <button
                                type="submit"
                                className="primary-button"
                                style={{
                                    height: '45px',
                                    boxSizing: 'border-box',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0 25px',
                                    margin: 0
                                }}
                            >
                                {isEditing ? 'Zapisz zmiany' : 'Utwórz rekrutację'}
                            </button>

                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="cancel-button"
                                    style={{
                                        height: '45px',
                                        boxSizing: 'border-box',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        margin: 0
                                    }}
                                >
                                    Anuluj
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Tabela rekrutacji */}
                <div className="admin-table-wrapper" style={{ overflowX: 'auto', marginTop: '20px' }}>
                    <table className="admin-table" style={{ width: '100%', minWidth: '750px', tableLayout: 'fixed' }}>
                        <thead>
                            <tr>
                                <th style={{ width: '45px', textAlign: 'center', padding: '10px 5px' }}>ID</th>
                                <th style={{ textAlign: 'left', padding: '10px 5px' }}>Nazwa rekrutacji</th>
                                <th style={{ width: '150px', textAlign: 'left', padding: '10px 5px' }}>Kierunek</th>
                                <th style={{ width: '110px', textAlign: 'center', padding: '10px 5px' }}>Termin</th>
                                <th style={{ width: '90px', textAlign: 'center', padding: '10px 5px' }}>Status</th>
                                <th style={{ width: '130px', textAlign: 'center', padding: '10px 5px' }}>Akcje</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recruitments.map(rec => (
                                <tr key={rec.id} className="table-row-hover">
                                    <td style={{ textAlign: 'center', color: '#8c8c8c', fontSize: '12px' }}>{rec.id}</td>

                                    <td style={{ padding: '8px 5px', overflow: 'hidden' }}>
                                        <div style={{
                                            fontWeight: '600',
                                            fontSize: '13px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }} title={rec.name}>
                                            {rec.name}
                                        </div>
                                    </td>

                                    <td style={{ padding: '8px 5px' }}>
                                        <div style={{
                                            fontSize: '12px',
                                            color: '#1890ff',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }} title={rec.course ? rec.course.name : 'Nieprzypisany'}>
                                            {getAssignedCourseName(rec)}
                                        </div>
                                    </td>

                                    <td style={{ textAlign: 'center', fontSize: '11px', lineHeight: '1.4', padding: '8px 5px' }}>
                                        <span style={{ color: '#595959' }}>{rec.startDate}</span>
                                        <br />
                                        <span style={{ color: '#bfbfbf', fontSize: '10px' }}>do</span>
                                        <br />
                                        <span style={{ color: '#595959' }}>{rec.endDate}</span>
                                    </td>

                                    <td style={{ textAlign: 'center', padding: '8px 5px' }}>
                                        <span style={{
                                            backgroundColor: rec.isActive ? '#f6ffed' : '#fff1f0',
                                            color: rec.isActive ? '#52c41a' : '#f5222d',
                                            padding: '2px 8px',
                                            borderRadius: '20px',
                                            fontSize: '10px',
                                            fontWeight: '600',
                                            border: `1px solid ${rec.isActive ? '#b7eb8f' : '#ffa39e'}`,
                                            display: 'inline-block'
                                        }}>
                                            {rec.isActive ? 'AKTYWNA' : 'NIEAKTYWNA'}
                                        </span>
                                    </td>

                                    <td style={{ textAlign: 'center', padding: '8px 5px' }}>
                                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                                            <button onClick={() => startEdit(rec)} className="details-button" style={{ padding: '4px 8px', fontSize: '11px' }}>
                                                Edytuj
                                            </button>
                                            <button
                                                onClick={() => handleDelete(rec.id)}
                                                className="btn-delete-outline"
                                                style={{ padding: '4px 8px', fontSize: '11px' }}
                                            >
                                                Usuń
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminRecruitmentManager;