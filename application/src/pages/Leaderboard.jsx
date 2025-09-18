import React, { useEffect, useState } from 'react'

export default function Leaderboard(){
  const [users, setUsers] = useState([])

  useEffect(()=>{
    // Dummy data for demonstration
    const dummyUsers = [
      { id: 'u1', name: 'Alice', score: 150 },
      { id: 'u2', name: 'Bob', score: 120 },
      { id: 'u3', name: 'Charlie', score: 180 },
      { id: 'u4', name: 'Diana', score: 100 },
      { id: 'u5', name: 'Eve', score: 90 }
    ]
    // Sort by score descending
    const sorted = dummyUsers.sort((a,b)=> b.score - a.score)
    setUsers(sorted)
  },[])

  return (
    <div className="leaderboard page">
      <h2>Leaderboard</h2>
      <ol className="leaderboard-list">
        {users.map(u=> (
          <li key={u.id}>
            <span className="user-name">{u.name}</span>
            <span className="user-score">{u.score} pts</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
