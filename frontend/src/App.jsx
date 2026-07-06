import { Routes, Route, Navigate } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from './context/AuthContext'

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
  const { userInfo, loading } = useContext(AuthContext)

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-ink">Loading...</div>
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream font-dm-sans text-ink">
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path='/login' element={userInfo ? <Navigate to="/home" replace /> : <LoginPage />} />
          <Route path='/register' element={userInfo ? <Navigate to="/home" replace /> : <RegisterPage />} />
          <Route path="/chat" element={userInfo ? <Chat /> : <Navigate to="/login" replace />} />
          <Route path="/search" element={userInfo ? <Search /> : <Navigate to="/login" replace />} />
          <Route path="/posts/:id" element={userInfo ? <PostDetail /> : <Navigate to="/login" replace />} />
          <Route path="/users/:userName" element={userInfo ? <UserProfile /> : <Navigate to="/login" replace />} />

        </Routes>
      </main>
    </>
  )
}

export default App
