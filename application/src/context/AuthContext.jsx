import React, { createContext, useState, useEffect } from 'react'
import { loadUsers, saveUsers } from '../api/storage'
import { v4 as uuid } from 'uuid'

export const AuthContext = createContext(null)

export function AuthProvider({children}){
  const [user, setUser] = useState(null)

  useEffect(()=>{
    try{
      const stored = localStorage.getItem('pqb_current_user')
      if(stored) setUser(JSON.parse(stored))
    }catch(e){
      localStorage.removeItem('pqb_current_user')
    }
  },[])

  function register({name,email,password}){
    const users = loadUsers()
    if(users.find(u=>u.email===email)) throw new Error('Email taken')
    const newUser = { id: uuid(), name: String(name||''), email: String(email||''), password: String(password||''), score: 0, quizzesCreated: [], quizzesTaken: [] }
    users.push(newUser)
    saveUsers(users)
    localStorage.setItem('pqb_current_user', JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  function login({email,password}){
    const users = loadUsers()
    const u = users.find(x=>x.email===email && x.password===password)
    if(!u) throw new Error('Invalid credentials')
    localStorage.setItem('pqb_current_user', JSON.stringify(u))
    setUser(u)
    return u
  }

  function logout(){
    localStorage.removeItem('pqb_current_user')
    setUser(null)
  }

  function refreshUser(){
    if(!user) return
    const users = loadUsers()
    const fresh = users.find(x=>x.id===user.id)
    if(fresh){
      setUser(fresh)
      localStorage.setItem('pqb_current_user', JSON.stringify(fresh))
    }
  }

  return (
    <AuthContext.Provider value={{user, register, login, logout, refreshUser}}>
      {children}
    </AuthContext.Provider>
  )
}