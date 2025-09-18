import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Profile(){
  const { user } = useContext(AuthContext)
  if(!user) return <p className="page">Please login first</p>

  return (
    <div className="profile-page page">
      <h2>Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Quizzes Created:</strong> {user.quizzesCreated?.length || 0}</p>
      <p><strong>Total Score:</strong> {user.score || 0}</p>
    </div>
  )
}
