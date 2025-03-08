import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import EduNFTLanding from './components/Landing/LandingPage'
import LoginSignup from './components/Auth/AuthComp'
const App = () => {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<EduNFTLanding />} />
            <Route path='/auth' element={<LoginSignup />} />
        </Routes>
    </BrowserRouter>
    )
}

export default App