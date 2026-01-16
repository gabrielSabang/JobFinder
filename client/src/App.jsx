import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Login from './components/Login';
import SignUp from './components/SignUp';
import CreatePost from './components/CreatePost';
import PostPage from './components/PostPage.jsx';
import Notifications from './components/Notifications';
import Messaging from './components/Messaging';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      <main className="container mx-auto p-4 mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/post/:postId" element={<PostPage />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/messaging" element={<Messaging />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;