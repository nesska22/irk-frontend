import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import AdminLoginForm from './components/AdminLoginForm';
import AdminDashboard from './components/AdminDashboard';
import AdminCoursesManager from './components/AdminCoursesManager';
import ResultsForm from './components/ResultsForm';
import EducationalOffer from './components/EducationalOffer';
import AdminRecruitmentManager from './components/AdminRecruitmentManager';
import CandidatesList from './components/CandidatesList';
import RecruitmentForm from './components/RecruitmentForm';
import RecruitmentList from './components/RecruitmentList';
import StudentProfile from './components/StudentProfile';

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
            <div className='dashboard-wrapper'>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <span className="irk-logo">System IRK</span>
                </div>
                <Dashboard/>
            </div>
        }/>

        <Route path="/profile" element={
            <div className='dashboard-wrapper'>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <span className="irk-logo">System IRK</span>
                </div>
                <StudentProfile />
            </div>
        } />

        <Route path='/recruitments' element={
            <div className='results-page-container'>
                <span className="irk-logo">System IRK</span>
                <RecruitmentForm/>
            </div>
        }/>

        <Route path='/educational-offer' element={
            <div className='app-container'>
            <h1>System IRK</h1>
            <EducationalOffer/>
            </div>
        }/>



        <Route path="/admin-dashboard" element={
            <div className='dashboard-wrapper'>
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <span className="irk-logo">System IRK</span>
                </div>
            <AdminDashboard/>
            </div>
        }/>

        <Route path="/admin/courses" element={
            <div className='dashboard-wrapper'>
            <span className="irk-logo">System IRK</span>
            <AdminCoursesManager/>
            </div>
        }/>

     <Route path="/admin/recruitments" element={
                <div className='app-container'>
                <h1>System IRK</h1>
                <AdminRecruitmentManager/>
                </div>
            }/>

        <Route path="/results" element={
          <div className="results-page-container">
          <span className="irk-logo">System IRK</span>
            <ResultsForm />
          </div>
        } />
        <Route path="/admin/candidates/:recruitmentId" element={
                    <div className='admin-page-container'>
                       <CandidatesList />
                    </div>
                }/>
        <Route path="/admin/recruitments-list" element={
            <div className='admin-page-container'>
               <RecruitmentList />
            </div>
        }/>
      </Routes>
    </Router>


  )
}

export default App;