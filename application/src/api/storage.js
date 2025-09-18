import { v4 as uuid } from 'uuid'

const USERS_KEY = 'pqb_users'
const QUIZZES_KEY = 'pqb_quizzes'

export function loadUsers(){
  try{
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
  }catch(e){
    localStorage.removeItem(USERS_KEY)
    return []
  }
}
export function saveUsers(users){
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function loadQuizzes(){
  try{
    return JSON.parse(localStorage.getItem(QUIZZES_KEY) || '[]')
  }catch(e){
    localStorage.removeItem(QUIZZES_KEY)
    return []
  }
}
export function saveQuizzes(qs){
  localStorage.setItem(QUIZZES_KEY, JSON.stringify(qs))
}

export function createQuiz({title, description, questions, authorId}){
  const q = { id: uuid(), title: String(title || '').trim(), description: String(description || ''), questions: questions || [], authorId, createdAt: Date.now() }
  const all = loadQuizzes()
  all.push(q)
  saveQuizzes(all)
  return q
}

export function getQuizById(id){
  const all = loadQuizzes()
  return all.find(q=>q.id===id) || null
}

export function updateUserScore(userId, delta){
  const users = loadUsers()
  const u = users.find(x=>x.id===userId)
  if(u){
    u.score = (Number(u.score) || 0) + Number(delta || 0)
    saveUsers(users)
  }
  return u || null
}