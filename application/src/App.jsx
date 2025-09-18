import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import CreateQuiz from './pages/CreateQuiz'
import QuizList from './pages/QuizList'
import QuizPage from './pages/QuizPage'
import Leaderboard from './pages/Leaderboard'
import AnimatedRoute from './components/AnimatedRoute'

export default function App(){
  return (
    <div className="app-root">
      <Navbar />
      <AnimatedRoute>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/register' element={<Register/>} />
          <Route path='/profile' element={<Profile/>} />
          <Route path='/create' element={<CreateQuiz/>} />
          <Route path='/quizzes' element={<QuizList/>} />
          <Route path='/quiz/:id' element={<QuizPage/>} />
          <Route path='/leaderboard' element={<Leaderboard/>} />
        </Routes>
      </AnimatedRoute>
    </div>
  )
}