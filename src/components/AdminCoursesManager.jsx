import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminEducationManager() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        id: null,
        name: '',
        placesLimit: 0,
        requirements: []
    });
    const [isEditing, setIsEditing] = useState(false);

    const availableSubjects = [
        "Język polski", "Matematyka", "Język angielski", "Fizyka",
        "Chemia", "Biologia", "Geografia", "Historia", "Wiedza o społeczeństwie", "Informatyka"
    ];

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

    const addRequirement = () => {
        setFormData({
            ...formData,
            requirements: [...formData.requirements, { subjectName: '', multiplier: 1.5 }]
        });
    };

    const updateRequirement = (index, field, value) => {
        const newReqs = [...formData.requirements];
        newReqs[index][field] = field === 'multiplier' ? parseFloat(value) : value;
        setFormData({ ...formData, requirements: newReqs });
    };

    const removeRequirement = (index) => {
        const newReqs = formData.requirements.filter((_, i) => i !== index);
        setFormData({ ...formData, requirements: newReqs });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (/\d/.test(formData.name)) {
            alert("Błąd: Nazwa kierunku nie może zawierać cyfr.");
            return;
        }
        if (formData.placesLimit <= 0) {
            alert("Błąd: Limit miejsc musi być większy od 0.");
            return;
        }
        const nameExists = courses.some(c =>
            c.name.toLowerCase() === formData.name.toLowerCase() && c.id !== formData.id
        );
        if (nameExists) {
            alert(`Błąd: Kierunek o nazwie "${formData.name}" już istnieje.`);
            return;
        }

        const invalidReqs = formData.requirements.some(r => r.subjectName === '');
        if (invalidReqs) {
            alert("Błąd: Wybierz nazwę przedmiotu dla wszystkich dodanych przeliczników.");
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
                alert(isEditing ? "Zaktualizowano kierunek!" : "Dodano nowy kierunek!");
            } else {
                const errorText = await response.text();
                alert("Błąd zapisu: " + errorText);
            }
        } catch (err) {
            alert("Błąd zapisu: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten kierunek?")) return;
        try {
            const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE', credentials: 'include' });
            if (response.ok) { fetchCourses(); }
        } catch (err) { alert("Błąd usuwania: " + err.message); }
    };

    const resetForm = () => {
        setFormData({ id: null, name: '', placesLimit: 0, requirements: [] });
        setIsEditing(false);
    };

    const startEdit = (course) => {
        setFormData({
            id: course.id,
            name: course.name,
            placesLimit: course.placesLimit,
            requirements: course.requirements || []
        });
        setIsEditing(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Ładowanie...</div>;

    return (
        <div className="admin-page-container">
            <div className="admin-content-card">

                <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                    <button onClick={() => navigate(-1)} className="back-button">
                        Powrót do panelu
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' }}>
                    <div style={{ width: '4px', height: '30px', backgroundColor: '#1890ff', borderRadius: '2px' }}></div>
                    <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1a1a1a', margin: 0 }}>
                        Zarządzanie Ofertą <span style={{ color: '#1890ff' }}>Edukacyjną</span>
                    </h1>
                </div>

                <div className="admin-form-section">
                    <h3 style={{ marginBottom: '20px', color: '#1890ff' }}>
                        {isEditing ? '📝 Edytuj kierunek' : '➕ Dodaj nowy kierunek'}
                    </h3>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                            <div style={{ flex: '3', minWidth: '300px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Nazwa kierunku</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d9d9d9' }}
                                    required
                                />
                            </div>
                            <div style={{ flex: '1', minWidth: '150px' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>Limit miejsc</label>
                                <input
                                    type="number"
                                    value={formData.placesLimit}
                                    onChange={(e) => setFormData({...formData, placesLimit: parseInt(e.target.value)})}
                                    style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #d9d9d9' }}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ backgroundColor: '#fafafa', padding: '15px', borderRadius: '8px', border: '1px dashed #d9d9d9' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                                <h4 style={{ margin: 0, color: '#595959', fontSize: '15px' }}>Przedmioty punktowane (Mnożniki)</h4>
                                <button type="button" onClick={addRequirement} style={{ padding: '6px 12px', backgroundColor: '#52c41a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                                    + Dodaj przedmiot
                                </button>
                            </div>

                            {formData.requirements.length === 0 ? (
                                <p style={{ fontSize: '13px', color: '#bfbfbf', margin: '0' }}>Brak przypisanych przedmiotów. Wynik kandydata wyniesie 0 pkt.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {formData.requirements.map((req, index) => (
                                        <div key={index} style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                                            <select
                                                value={req.subjectName}
                                                onChange={(e) => updateRequirement(index, 'subjectName', e.target.value)}
                                                style={{ flex: '2', minWidth: '200px', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d9d9d9', backgroundColor: '#fff' }}
                                                required
                                            >
                                                <option value="" disabled>Wybierz przedmiot...</option>
                                                {availableSubjects.map(sub => (
                                                    <option key={sub} value={sub}>{sub}</option>
                                                ))}
                                            </select>

                                        <div style={{ flex: '1', minWidth: '100px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '14px', color: '#8c8c8c', fontWeight: 'bold' }}>x</span>
                                            <select
                                                value={req.multiplier}
                                                onChange={(e) => updateRequirement(index, 'multiplier', e.target.value)}
                                                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid #d9d9d9', backgroundColor: '#fff' }}
                                                required
                                            >
                                                <option value="1.5">1,5</option>
                                                <option value="2">2,0</option>
                                            </select>
                                        </div>
                                            <button type="button" onClick={() => removeRequirement(index)} style={{ padding: '8px 12px', backgroundColor: '#fff1f0', color: '#f5222d', border: '1px solid #ffa39e', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
                                                Usuń
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button type="submit" className="primary-button" style={{ height: '46px', padding: '0 30px' }}>
                                {isEditing ? 'Zapisz zmiany' : 'Dodaj kierunek'}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={resetForm} className="cancel-button" style={{ height: '46px', padding: '0 30px' }}>
                                    Anuluj
                                </button>
                            )}
                        </div>

                    </form>
                </div>

                <div className="admin-table-wrapper" style={{ marginTop: '30px' }}>
                    <div style={{ overflowX: 'auto' }}>
                        <table className="admin-table" style={{ width: '100%' }}>
                            <thead>
                                <tr>
                                    <th className="col-id" style={{ width: '60px' }}>ID</th>
                                    <th className="col-name">Nazwa Kierunku</th>
                                    <th className="col-limit" style={{ width: '120px' }}>Limit Miejsc</th>
                                    <th className="col-reqs">Przedmioty Punktowane</th>
                                    <th className="col-actions" style={{ width: '150px' }}>Akcje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => (
                                    <tr key={course.id} className="table-row-hover">
                                        <td className="col-id" style={{ color: '#8c8c8c' }}>#{course.id}</td>
                                        <td className="col-name"><strong>{course.name}</strong></td>
                                        <td className="col-limit">
                                            <span style={{
                                                backgroundColor: '#e6f7ff',
                                                color: '#1890ff',
                                                padding: '5px 12px',
                                                borderRadius: '15px',
                                                fontWeight: '600',
                                                display: 'inline-block'
                                            }}>
                                                {course.placesLimit}
                                            </span>
                                        </td>
                                        <td className="col-reqs" style={{ fontSize: '13px', color: '#595959' }}>
                                            {course.requirements && course.requirements.length > 0 ? (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                    {course.requirements.map((r, i) => (
                                                        <span key={i} style={{ backgroundColor: '#f5f5f5', border: '1px solid #d9d9d9', padding: '2px 8px', borderRadius: '4px' }}>
                                                            {r.subjectName} <strong style={{color: '#52c41a'}}>(x{r.multiplier})</strong>
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                <span style={{ color: '#bfbfbf', fontStyle: 'italic' }}>Brak wymagań</span>
                                            )}
                                        </td>
                                        <td className="col-actions">
                                            <div className="actions-container" style={{ display: 'flex', gap: '10px' }}>
                                                <button onClick={() => startEdit(course)} className="link-button" style={{ color: '#1890ff', fontWeight: '500' }}>Edytuj</button>
                                                <button onClick={() => handleDelete(course.id)} className="link-button" style={{ color: '#ff4d4f', fontWeight: '500' }}>Usuń</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {courses.length === 0 && (
                                    <tr>
                                        <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#bfbfbf' }}>Brak dodanych kierunków w systemie.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminEducationManager;