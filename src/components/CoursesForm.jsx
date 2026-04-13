import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CoursesForm() {
    const [courses, setCourses] = useState([]);
    const [selectedCourses, setSelectedCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await fetch('http://localhost:8081/api/courses');
                if (!response.ok) {
                    throw new Error('Błąd podczas pobierania kierunków');
                }
                const data = await response.json();
                setCourses(data);
            } catch (err) {
                setError(err.message);
                setCourses([
                    { id: 1, name: 'Informatyka' },
                    { id: 2, name: 'Zarządzanie' },
                    { id: 3, name: 'Psychologia' },
                    { id: 4, name: 'Automatyka i Robotyka' },
                    { id: 5, name: 'Architektura' },
                    { id: 6, name: 'Budownictwo' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    const handleToggleCourse = (courseId) => {
        setSelectedCourses(prevSelected =>
            prevSelected.includes(courseId)
                ? prevSelected.filter(id => id !== courseId)
                : [...prevSelected, courseId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Wybrane kierunki:", selectedCourses);
        alert("Kierunki zostały wybrane!");
        navigate('/dashboard');
    };

    if (loading) return <div>Ładowanie kierunków...</div>;

    return (
        <div className="courses-container" style={{ maxWidth: '500px', margin: '0 auto', padding: '20px' }}>
            <h2 style={{ textAlign: 'center' }}>Wybierz interesujące Cię kierunki</h2>

            {error && <p style={{ color: 'orange', textAlign: 'center', fontSize: '14px' }}>
                Tryb demonstracyjny: połączenie z serwerem nieudane.
            </p>}

            <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                <div className="courses-list" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    backgroundColor: '#f9f9f9',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: 'inset 0 0 5px rgba(0,0,0,0.1)',
                    marginBottom: '20px'
                }}>
                    {courses.map(course => (
                        <div key={course.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px 12px',
                            backgroundColor: 'white',
                            borderRadius: '6px',
                            border: '1px solid #eee',
                            transition: 'background-color 0.2s'
                        }}>
                            <input
                                type="checkbox"
                                id={`course-${course.id}`}
                                checked={selectedCourses.includes(course.id)}
                                onChange={() => handleToggleCourse(course.id)}
                                style={{
                                    width: '18px',
                                    height: '18px',
                                    cursor: 'pointer',
                                    margin: 0,
                                    marginRight: '15px'
                                }}
                            />
                            <label
                                htmlFor={`course-${course.id}`}
                                style={{
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    flex: 1,
                                    userSelect: 'none',
                                    textAlign: 'left'
                                }}
                            >
                                {course.name}
                            </label>
                        </div>
                    ))}
                </div>

                <div style={{ textAlign: 'center' }}>
                    {selectedCourses.length === 0 ? (
                        <p style={{ color: '#ff4d4f', fontSize: '14px', marginBottom: '15px' }}>
                            Proszę wybrać przynajmniej jeden kierunek.
                        </p>
                    ) : (
                        <p style={{ color: '#52c41a', fontSize: '14px', marginBottom: '15px' }}>
                            Wybrano kierunków: {selectedCourses.length}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={selectedCourses.length === 0}
                        style={{
                            width: '100%',
                            padding: '12px',
                            backgroundColor: selectedCourses.length === 0 ? '#ccc' : '#1890ff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: selectedCourses.length === 0 ? 'not-allowed' : 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}
                    >
                        Zatwierdź i przejdź do panelu
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CoursesForm;
