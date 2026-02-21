import './App.css'
import { Routes, Route } from 'react-router-dom'

import Home from "./components/Home"
import Navbar from './components/Navbar'
import About from './components/About'
import LandingPage from './components/LandingPage'
import Contact from './components/Contact'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import { ChatList } from './components/ChatList'
import { ChatRoom } from './components/ChatRoom'


function App() {
  

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/chats" element={<ChatList />} />
        <Route path="/chatroom" element={<ChatRoom />} />

      </Routes>
    </>
  )
}

export default App
