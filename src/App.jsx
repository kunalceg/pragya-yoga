import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar/Navbar"
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import About from './pages/About'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App