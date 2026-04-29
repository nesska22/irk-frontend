import { useState, useEffect } from 'react';

function AdminEducationManager() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({ id: null, name: '', placesLimit: 0 });
        const [isEditing, setIsEditing] = useState(false);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            }
        } catch (err) {
            alert("Błąd zapisu: " + err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Czy na pewno chcesz usunąć ten kierunek?")) return;

        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (response.ok) fetchCourses();
        } catch (err) {
            alert("Błąd usuwania");
        }
    };

    const resetForm = () => {
        setFormData({ id: null, name: '', placesLimit: 0 });
        setIsEditing(false);
    };

    const startEdit = (course) => {
        setFormData(course);
        setIsEditing(true);
    };

    if (loading) return <div>Ładowanie panelu administratora...</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial' }}>
            <h2>Panel Administratora: Oferta Edukacyjna</h2>

            {/* FORMULARZ EDYCJI/DODAWANIA */}
            <div style={{ backgroundColor: '#f0f2f5', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
                <h3>{isEditing ? 'Edytuj kierunek' : 'Dodaj nowy kierunek'}</h3>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Nazwa kierunku"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        required
                    />
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Limit miejsc:</label>
                    <input
                        type="number"
                        placeholder="0"
                        value={formData.placesLimit}
                        onChange={(e) => setFormData({...formData, placesLimit: parseInt(e.target.value)})}
                        style={{ width: '100%', padding: '8px', marginBottom: '15px', boxSizing: 'border-box' }}
                        required
                    />
                    <button type="submit" style={{ backgroundColor: '#52c41a', color: 'white', border: 'none', padding: '10px 20px', cursor: 'pointer', borderRadius: '4px' }}>
                        {isEditing ? 'Zapisz zmiany' : 'Dodaj kierunek'}
                    </button>
                    {isEditing && <button onClick={resetForm} style={{ marginLeft: '10px' }}>Anuluj</button>}
                </form>
            </div>

            {/* LISTA KIERUNKÓW Z OPCJAMI EDYCJI */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                        <th style={{ padding: '10px' }}>ID</th>
                        <th>Nazwa</th>
                        <th>Limit miejsc</th>
                        <th>Akcje</th>
                    </tr>
                </thead>
                <tbody>
                    {courses.map(course => (
                        <tr key={course.id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '10px' }}>{course.id}</td>
                            <td><strong>{course.name}</strong></td>
                            <td><strong>{course.placesLimit}</strong></td>
                            <td>
                                <button onClick={() => startEdit(course)} style={{ marginRight: '5px', cursor: 'pointer' }}>Edytuj</button>
                                <button onClick={() => handleDelete(course.id)} style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', cursor: 'pointer' }}>Usuń</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminEducationManager;