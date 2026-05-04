// src/components/AdminDashboard.jsx
import { useState } from 'react';
import AdminCoursesManager from './AdminCoursesManager';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('courses');

    return (
        <div className="admin-layout" style={{ 
            minHeight: '100vh', 
            backgroundColor: '#f0f2f5', // Nieco ciemniejsze tło dla lepszego kontrastu
            fontFamily: 'Segoe UI, Roboto, Helvetica, Arial, sans-serif'
        }}>
            {/* TOP BAR - Rozciągnięty na całą szerokość */}
            <nav style={{
                height: '70px',
                backgroundColor: '#001529', // Ciemny, profesjonalny kolor (styl Ant Design)
                display: 'flex',
                alignItems: 'center',
                padding: '0 50px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                justifyContent: 'space-between',
                color: 'white'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '50px' }}>
                    <span style={{ 
                        fontWeight: '800', 
                        color: '#1890ff', 
                        fontSize: '24px', 
                        letterSpacing: '1px' 
                    }}>IRK PRO</span>
                    
                    <div style={{ display: 'flex', gap: '30px' }}>
                        <button 
                            onClick={() => setActiveTab('courses')}
                            style={tabButtonStyle(activeTab === 'courses')}>
                            Oferta Edukacyjna
                        </button>
                        <button 
                            onClick={() => setActiveTab('users')}
                            style={tabButtonStyle(activeTab === 'users')}>
                            Zarządzanie Kandydatami
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '14px', fontWeight: 'bold' }}>Administrator</div>
                        <div style={{ fontSize: '12px', color: '#aaa' }}>admin@admin.com</div>
                    </div>
                    <button style={{
                        padding: '8px 16px',
                        backgroundColor: 'transparent',
                        color: '#ff4d4f',
                        border: '1px solid #ff4d4f',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#ff4d4f22'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
                        Wyloguj
                    </button>
                </div>
            </nav>

            {/* GŁÓWNA SEKCJA - POWIĘKSZONA */}
            <main style={{ 
                padding: '30px 50px', 
                width: '100%', // Wykorzystujemy 100% szerokości
                boxSizing: 'border-box' 
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                    minHeight: '80vh',
                    padding: '40px'
                }}>
                    {activeTab === 'courses' && <AdminCoursesManager />}
                    {activeTab === 'users' && <h2>Moduł zarządzania kandydatami w przygotowaniu</h2>}
                </div>
            </main>
        </div>
    );
}

const tabButtonStyle = (isActive) => ({
    background: 'none',
    border: 'none',
    borderBottom: isActive ? '3px solid #1890ff' : '3px solid transparent',
    color: isActive ? '#1890ff' : '#ffffffb3',
    padding: '23px 0',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: isActive ? 'bold' : '500',
    transition: 'all 0.2s'
});

export default AdminDashboard;