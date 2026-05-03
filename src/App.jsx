import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import AdminLoginForm from './components/AdminLoginForm';
import AdminDashboard from './components/AdminDashboard';
import CoursesForm from './components/CoursesForm';
import AdminCoursesManager from './components/AdminCoursesManager';
import ResultsForm from './components/ResultsForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to ="/login"/>}/>

        <Route path='/login' element={
          <div className='app-container'>
            <h1>System IRK</h1>
            <LoginForm/>
          </div>
        }/>

        <Route path='/register' element={
          <div className='app-container'>
            <h1>System IRK</h1>
            <RegisterForm/>
          </div>
        }/>

        <Route path="/admin/login" element={
          <div className='app-container'>
            <h1>System IRK</h1>
            <AdminLoginForm/>
          </div>
        }/>

        <Route path='/dashboard' element={
            <div className='app-container'>
            <h1>System IRK</h1>
            <Dashboard/>
            </div>
        }/>

        <Route path='/courses' element={
            <div className='app-container'>
            <h1>System IRK</h1>
            <CoursesForm/>
            </div>
        }/>

        <Route path="/admin-dashboard" element={
            <div className='app-container'>
            <h1>System IRK</h1>
            <AdminDashboard/>
            </div>
        }/>

        <Route path="/admin/courses" element={
            <div className='app-container'>
            <h1>System IRK</h1>
            <AdminCoursesManager/>
            </div>
        }/>

        <Route path="/results" element={
          <div className="results-page-container">
          <h1>System IRK</h1>
            <ResultsForm />
          </div>
        } />
      </Routes>
    </Router>
  )
}

export default App;