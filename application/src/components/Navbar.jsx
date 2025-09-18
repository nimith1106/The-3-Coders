import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Navbar(){
  const { user, logout } = useContext(AuthContext)

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">Peer Quiz Battle</Link>
      </div>
      <div className="navbar-links">
        <Link to="/quizzes">Quizzes</Link>
        <Link to="/create">Create Quiz</Link>
        <Link to="/leaderboard">Leaderboard</Link>
        {user ? (
          <>
            <Link to="/profile">{user.name}</Link>
            <button onClick={logout} className="btn-logout">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  )
}
