import React from 'react';
import GuestNavbar  from './components/GuestNavbar';
import Footer from './components/Footer'
import {Route,Routes,useLocation} from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CitizenDashboard from './pages/CitizenDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PoliceDashboard from './pages/PoliceDashboard';
const App=()=>{
  return (
    <div>
      <GuestNavbar />
      <div className='min-h-70vh'>
          <Routes>
            <Route path='/' element={<HomePage />}/>
            <Route path='/login' element={<LoginPage />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/citizendashboard' element={<CitizenDashboard />} />
            <Route path='/policedashboard' element={<PoliceDashboard />} />
            <Route path='/admindashboard' element={<AdminDashboard />} />
          </Routes>
      </div>
      <Footer />
    </div>
  )
}
export default App;