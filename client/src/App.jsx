import React from 'react';
import GuestNavbar from './components/GuestNavbar';
import {Route,Routes,useLocation} from 'react-router-dom';
import HomePage from './pages/HomePage';
const App=()=>{
  return (
    <div>
      <GuestNavbar />
      <div className='min-h-[70vh'>
          <Routes>
            <Route path='/' element={<HomePage />}/>
          </Routes>
      </div>
    </div>
  )
}
export default App;