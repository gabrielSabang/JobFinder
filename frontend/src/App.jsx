import './App.css'
import { Routes, Route } from 'react-router-dom'

import Home from "./components/Home"
import Navbar from './components/Navbar'
import About from './components/About'
import LandingPage from './components/LandingPage'
import Contact from './components/Contact'
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import Chat from './components/Chat.jsx'
import Search from './components/Search.jsx'
import PostDetail from './components/PostDetail.jsx'
import UserProfile from './components/UserProfile.jsx'


function App() {
  

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/search" element={<Search />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/users/:userName" element={<UserProfile />} />

        </Routes>
      </main>
    </>
  )
}

export default App
