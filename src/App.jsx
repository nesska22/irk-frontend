import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import AdminLoginForm from './components/AdminLoginForm';
import AdminDashboard from './components/AdminDashboard';


function App() {
  return (
    <Router>
      <div className='app-container'>
        <h1>System IRK</h1>
        <Routes>
          <Route path='/' element={<Navigate to ="/login"/>}/>

          <Route path='/login' element={<LoginForm/>}/>

          <Route path='/register' element={<RegisterForm/>}/>

          <Route path='/dashboard' element={<Dashboard/>}/>

          <Route path="/admin/login" element={<AdminLoginForm/>} />

          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
