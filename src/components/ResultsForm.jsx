import { useState } from 'react';
import { useNavigate } from "react-router-dom";

function ResultsForm() {
    const [mandatory, setMandatory] = useState({ "Język polski": '', "Matematyka": '', "Język angielski": '' });
    const [extended, setExtended] = useState([{ subject: '', value: '' }]);

    const schoolSubjects = [
        "Język polski", "Język angielski", "Matematyka", "Fizyka",
        "Chemia", "Biologia", "Geografia", "Historia", "Informatyka", "Wiedza o społeczeństwie"
    ];

    const [grades, setGrades] = useState(
        schoolSubjects.map(subject => ({ subject, value: '' }))
    );

    const [errors, setErrors] = useState([]);

    const availableSubjects = ["Język polski", "Matematyka", "Język angielski", "Fizyka",
        "Chemia", "Biologia", "Geografia", "Historia", "Wiedza o społeczeństwie", "Informatyka"];

    const handleMandatoryChange = (subject, val) => {
        const value = Math.max(0, Math.min(100, parseFloat(val)));
        setMandatory({ ...mandatory, [subject]: value });
        if (value !== '') setErrors(prev => prev.filter(e => e !== `mandatory-${subject}`));
    };

    const handleExtendedChange = (index, field, val) => {
        const newExtended = [...extended];
        if (field === 'subject' && val !== "") {
            const isDuplicate = extended.some((item, i) => i !== index && item.subject === val);
            if (isDuplicate) {
                alert(`Przedmiot "${val}" został już wybrany!`);
                newExtended[index][field] = '';
                setExtended(newExtended);
                return;
            }
        }
        const newValue = field === 'value'
            ? (val === '' ? '' : Math.max(0, Math.min(100, parseFloat(val) || 0)))
            : val;

        newExtended[index][field] = newValue;
        setExtended(newExtended);

        if (newValue !== '') {
            const errorId = field === 'subject' ? `extended-${index}-sub` : `extended-${index}-val`;
            setErrors(prev => prev.filter(e => e !== errorId));
        }
    };

    const handleGradeChange = (index, val) => {
        const newGrades = [...grades];
        const value = val === '' ? '' : Math.max(2, Math.min(6, parseInt(val) || 2));
        newGrades[index].value = value;
        setGrades(newGrades);

        if (value !== '') {
            setErrors(prev => prev.filter(e => e !== `grade-${index}`));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = [];

        // Walidacja matur podstawowych
        Object.keys(mandatory).forEach(key => {
            if (mandatory[key] === '') newErrors.push(`mandatory-${key}`);
        });

        // Walidacja ocen
        grades.forEach((g, index) => {
            if (g.value === '') newErrors.push(`grade-${index}`);
        });

        // Walidacja rozszerzeń
        extended.forEach((ex, index) => {
            if (ex.subject === '') newErrors.push(`extended-${index}-sub`);
            if (ex.value === '') newErrors.push(`extended-${index}-val`);
        });

        // Sprawdzenie czy jest minimum jedno PEŁNE rozszerzenie
        const hasFullExtended = extended.some(ex => ex.subject !== '' && ex.value !== '');

        if (newErrors.length > 0 || !hasFullExtended) {
            setErrors(newErrors);
            alert("Proszę uzupełnić wszystkie wymagane pola oznaczone na czerwono.");
            return;
        }

        const validExtended = extended.filter(ex => ex.subject !== '' && ex.value !== '');
        const payload = { mandatory, extended: validExtended, grades };
        try {
            const response = await fetch('http://localhost:8081/api/results/full-profile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify(payload)
            });
            if (response.ok) alert("Wyniki zostały zapisane!");

        } catch (err) {
            alert("Błąd połączenia z backendem");
        }
    };

        const blockInvalidChar = (e) => {
            if (['-', '+', 'e', 'E', ',', '.'].includes(e.key)) {
                e.preventDefault();
            }
        };


    const sectionStyle = {
        backgroundColor: '#fff',
        padding: '25px',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        width: '100%',
        boxSizing: 'border-box',
        marginBottom: '30px'
    };

    const inputStyle = { width: '100%', padding: '12px', borderRadius: '6px', border: '1px solid #d9d9d9', boxSizing: 'border-box' };

    const getErrorStyle = (fieldId) => ({
            ...inputStyle,
            border: errors.includes(fieldId) ? '2px solid #ff4d4f' : '1px solid #d9d9d9',
            backgroundColor: errors.includes(fieldId) ? '#fff2f0' : '#fff'
    });

    return (
        <div style={{ padding: '20px', boxSizing: 'border-box' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px'}}>
                <p style={{ fontSize: '18px', color: '#666', fontWeight: '500' }}>
                    Wprowadź wyniki egzaminów maturalnych i oceny ze świadectwa.
                </p>
            </div>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '30px',
                    width: '100%',
                    alignItems: 'start'
                }}>

                    {/* MATURY */}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={sectionStyle}>
                            <h3 style={{ color: '#52c41a', borderBottom: '2px solid #52c41a', paddingBottom: '10px' }}>Matura Podstawowa</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '15px' }}>
                                {['Język polski', 'Matematyka', 'Język angielski'].map(sub => (
                                    <div key={sub}>
                                        <label style={{ display: 'block', fontWeight: '600', marginBottom: '5px', textTransform: 'capitalize' }}>{sub} (%):</label>
                                        <input
                                            type="number"
                                            value={mandatory[sub]}
                                            onKeyDown={blockInvalidChar}
                                            onChange={(e) => handleMandatoryChange(sub, e.target.value)}
                                            style={getErrorStyle(`mandatory-${sub}`)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={sectionStyle}>
                            <h3 style={{ color: '#1890ff', borderBottom: '2px solid #1890ff', paddingBottom: '10px' }}>Matura Rozszerzona</h3>
                            <div style={{ marginTop: '15px' }}>
                                {extended.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                                        <select
                                                value={item.subject}
                                                onChange={(e) => handleExtendedChange(index, 'subject', e.target.value)}
                                                style={{ ...getErrorStyle(`extended-${index}-sub`), flex: 2 }}
                                            >
                                            <option value="">Wybierz...</option>
                                            {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                        <input
                                            type="number"
                                            value={item.value}
                                            onKeyDown={blockInvalidChar}
                                            onChange={(e) => handleExtendedChange(index, 'value', e.target.value)}
                                            style={{ ...getErrorStyle(`extended-${index}-val`), flex: 1 }}
                                            placeholder="%"
                                        />
                                        <button type="button" onClick={() => setExtended(extended.filter((_, i) => i !== index))} style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}>✕</button>
                                    </div>
                                ))}
                                <button type="button" onClick={() => setExtended([...extended, { subject: '', value: '' }])} style={{ width: '100%', padding: '10px', cursor: 'pointer', border: '1px dashed #1890ff', borderRadius: '6px', color: '#1890ff' }}>+ Dodaj przedmiot</button>
                            </div>
                        </div>
                    </div>

                    {/* OCENY ZE ŚWIADECTWA */}
                    <div style={sectionStyle}>
                        <h3 style={{ color: '#faad14', borderBottom: '2px solid #faad14', paddingBottom: '10px' }}>Oceny ze świadectwa</h3>
                        <div style={{ marginTop: '15px' }}>
                            {grades.map((item, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '12px',
                                    padding: '8px',
                                    borderBottom: '1px solid #f0f0f0'
                                }}>
                                    <span style={{ fontWeight: '500', color: '#333', flex: 2 }}>{item.subject}</span>
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <label style={{ fontSize: '12px', color: '#888' }}>Ocena:</label>
                                        <input
                                            type="number"
                                            value={item.value}
                                            onKeyDown={blockInvalidChar}
                                            onChange={(e) => handleGradeChange(index, e.target.value)}
                                            style={{ ...getErrorStyle(`grade-${index}`), textAlign: 'center', padding: '8px' }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p style={{ fontSize: '12px', color: '#999', marginTop: '10px', textAlign: 'center' }}>
                            Wprowadź oceny w skali 2-6 zgodnie ze świadectwem ukończenia szkoły.
                        </p>
                    </div>
                </div>
                <div style={{ marginTop: '30px', textAlign: 'center' }}>
                    <button type="submit" style={{ padding: '15px 100px', backgroundColor: '#52c41a', color: 'white', border: 'none', borderRadius: '8px', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(82, 196, 26, 0.3)' }}>
                        Zapisz wyniki
                    </button>
                </div>
            </form>
        </div>
    );
}

export default ResultsForm;