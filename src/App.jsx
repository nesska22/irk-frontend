import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';

function App() {
  return (
    <Router>
      <div style={{padding:'40px'}}>
        <h1>System IRK</h1>
        <Routes>
          <Route path='/' element={<Navigate to ="/login"/>}/>

          <Route path='/login' element={<LoginForm/>}/>

          <Route path='/register' element={<RegisterForm/>}/>

          <Route path='/dashboard' element={<h2>Witaj w panelu kandydata!</h2>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
