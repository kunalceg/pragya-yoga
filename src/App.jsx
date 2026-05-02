import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from "./components/Navbar/Navbar"
import Footer from './components/Footer/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Classes from './pages/Classes'
import YTTC from './pages/YTTC'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/yttc" element={<YTTC />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}

export default App
