import { useState, useEffect } from 'react';

function AdminEducationManager() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({ 
        id: null, 
        name: '', 
        placesLimit: 0,
        startDate: '',
        endDate: '' 
    });
    const [isEditing, setIsEditing] = useState(false);
    const [statusMsg, setStatusMsg] = useState({ text: '', type: '' });

    const API_URL = 'http://localhost:8081/api/courses';

    const fetchCourses = async () => {
        try {
            const response = await fetch(API_URL, { credentials: 'include' });
            if (!response.ok) throw new Error('Błąd pobierania danych');
            const data = await response.json();
            setCourses(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCourses(); }, []);

    const showStatus = (text, type) => {
        setStatusMsg({ text, type });
        setTimeout(() => setStatusMsg({ text: '', type: '' }), 4000);
    };

    // Funkcja pomocnicza do kolorowania statusów (SCRUM-79)
    const getStatusStyle = (status) => {
        const base = {
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 'bold',
            whiteSpace: 'nowrap'
        };
        switch (status) {
            case 'AKTYWNY':
                return { ...base, backgroundColor: '#f6ffed', color: '#52c41a', border: '1px solid #b7eb8f' };
            case 'PLANOWANY':
                return { ...base, backgroundColor: '#e6f7ff', color: '#1890ff', border: '1px solid #91d5ff' };
            case 'ZAKOŃCZONY':
            case 'BRAK_MIEJSC':
                return { ...base, backgroundColor: '#fff1f0', color: '#ff4d4f', border: '1px solid #ffccc7' };
            default:
                return { ...base, backgroundColor: '#f5f5f5', color: '#8c8c8c', border: '1px solid #d9d9d9' };
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (/\d/.test(formData.name)) {
            showStatus("Nazwa kierunku nie może zawierać cyfr.", "error");
            return;
        }
        if (formData.placesLimit <= 0) {
            showStatus("Limit miejsc musi być większy od 0.", "error");
            return;
        }
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            showStatus("Data zakończenia musi być późniejsza niż rozpoczęcia.", "error");
            return;
        }

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_URL}/${formData.id}` : API_URL;

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchCourses();
                resetForm();
                showStatus(isEditing ? "Zaktualizowano pomyślnie!" : "Dodano nowy kierunek!", "success");
            }
        } catch (err) {
            showStatus("Błąd zapisu: " + err.message, "error");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten kierunek?")) return;
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) {
                showStatus("Kierunek został usunięty.", "success");
                fetchCourses();
            }
        } catch (err) {
            showStatus("Błąd usuwania: " + err.message, "error");
        }
    };

    const resetForm = () => {
        setFormData({ id: null, name: '', placesLimit: 0, startDate: '', endDate: '' });
        setIsEditing(false);
    };

    const startEdit = (course) => {
        setFormData(course);
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div style={{ padding: '50px', textAlign: 'center' }}>Ładowanie danych...</div>;

    return (
        <div style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, color: '#1f1f1f', fontSize: '28px' }}>Zarządzanie Ofertą Edukacyjną</h1>
                {statusMsg.text && (
                    <div style={{
                        padding: '10px 20px', borderRadius: '6px',
                        backgroundColor: statusMsg.type === 'success' ? '#f6ffed' : '#fff1f0',
                        color: statusMsg.type === 'success' ? '#52c41a' : '#ff4d4f',
                        border: `1px solid ${statusMsg.type === 'success' ? '#b7eb8f' : '#ffccc7'}`,
                        fontWeight: '600'
                    }}>
                        {statusMsg.text}
                    </div>
                )}
            </div>

            {/* FORMULARZ */}
            <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '12px', border: '1px solid #e8e8e8', marginBottom: '40px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                <h3 style={{ marginTop: 0, marginBottom: '20px' }}>{isEditing ? '📝 Edytuj dane' : '➕ Dodaj kierunek'}</h3>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px', alignItems: 'end' }}>
                    <div>
                        <label style={labelStyle}>Nazwa</label>
                        <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} style={inputStyle} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Limit</label>
                        <input type="number" value={formData.placesLimit} onChange={(e) => setFormData({...formData, placesLimit: parseInt(e.target.value) || 0})} style={inputStyle} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Początek</label>
                        <input type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} style={inputStyle} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Koniec</label>
                        <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} style={inputStyle} required />
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <button type="submit" style={isEditing ? saveBtnStyle : addBtnStyle}>{isEditing ? 'Zapisz' : 'Dodaj'}</button>
                        {isEditing && <button type="button" onClick={resetForm} style={cancelBtnStyle}>Anuluj</button>}
                    </div>
                </form>
            </div>

            {/* TABELA */}
            <div style={{ backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e8e8e8', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#fafafa', borderBottom: '2px solid #f0f0f0' }}>
                            <th style={thStyle}>ID</th>
                            <th style={thStyle}>Nazwa</th>
                            <th style={thStyle}>Limit</th>
                            <th style={thStyle}>Data rozpoczęcia</th>
                            <th style={thStyle}>Data zakończenia</th>
                            <th style={thStyle}>Status</th> 
                            <th style={thStyle}>Akcje</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(course => (
                            <tr key={course.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                <td style={tdStyle}>{course.id}</td>
                                <td style={{ ...tdStyle, fontWeight: '600' }}>{course.name}</td>
                                <td style={tdStyle}>{course.placesLimit}</td>
                                <td style={tdStyle}>{course.startDate}</td>
                                <td style={tdStyle}>{course.endDate}</td>
                                <td style={tdStyle}>
                                    <span style={getStatusStyle(course.status)}>
                                        {course.status ? course.status.replace('_', ' ') : 'NIEZNANY'}
                                    </span>
                                </td>
                                <td style={tdStyle}>
                                    <button onClick={() => startEdit(course)} style={actionBtnEdit}>Edytuj</button>
                                    <button onClick={() => handleDelete(course.id)} style={actionBtnDelete}>Usuń</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// STYLE BEZ ZMIAN (labelStyle, inputStyle, thStyle, tdStyle, addBtnStyle, saveBtnStyle, cancelBtnStyle, actionBtnEdit, actionBtnDelete)
const labelStyle = { display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#555' };
const inputStyle = { width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d9d9d9', fontSize: '14px' };
const thStyle = { padding: '16px', textAlign: 'left', color: '#8c8c8c', fontSize: '13px', textTransform: 'uppercase' };
const tdStyle = { padding: '16px', color: '#262626', fontSize: '14px' };
const addBtnStyle = { backgroundColor: '#52c41a', color: 'white', border: 'none', padding: '11px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', flex: 1 };
const saveBtnStyle = { backgroundColor: '#1890ff', color: 'white', border: 'none', padding: '11px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', flex: 1 };
const cancelBtnStyle = { backgroundColor: '#fff', border: '1px solid #d9d9d9', padding: '11px 20px', borderRadius: '6px', cursor: 'pointer' };
const actionBtnEdit = { background: 'none', border: 'none', color: '#1890ff', cursor: 'pointer', marginRight: '15px', fontWeight: '600' };
const actionBtnDelete = { background: 'none', border: 'none', color: '#ff4d4f', cursor: 'pointer', fontWeight: '600' };

export default AdminEducationManager;