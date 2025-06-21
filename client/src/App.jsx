import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer'
import {Route,Routes,} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PoliceDashboard from './pages/PoliceDashboard';
import HomeRedirect from './components/HomeRedirect';
import CitizenComplaintPage from './pages/CitizenComplaintPage';
const App=()=>{
  return (
    <div>
      <Navbar />
      <div className='min-h-70vh'>
          <Routes>
            <Route path='/' element={<HomeRedirect />} />
            <Route path='/landingpage' element={<HomePage />}/>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/citizendashboard' element={<CitizenDashboard />} />
            <Route path='/policedashboard' element={<PoliceDashboard />} />
            <Route path='/admindashboard' element={<AdminDashboard />} />
            <Route path='/citizenComplaintPage' element={<CitizenComplaintPage />} />
          </Routes>
      </div>
      <Footer />
    </div>
  )
}
export default App;