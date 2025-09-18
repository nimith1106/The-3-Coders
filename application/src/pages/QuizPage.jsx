import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getQuizById, updateUserScore, loadUsers, saveUsers } from '../api/storage'
import { AuthContext } from '../context/AuthContext'

export default function QuizPage(){
  const { id } = useParams()
  const navigate = useNavigate()
  const quiz = getQuizById(id)
  const { user, refreshUser } = useContext(AuthContext)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)
  const [gainedScore, setGainedScore] = useState(0)

  useEffect(()=>{
    if(!quiz){
      // quiz not found — navigate back to quizzes list after short delay
      const t = setTimeout(()=> navigate('/quizzes'), 1000)
      return ()=> clearTimeout(t)
    }
  },[quiz, navigate])

  function pick(qi, choiceIdx){
    setAnswers(prev=>({ ...prev, [qi]: Number(choiceIdx) }))
  }

  function submit(){
    if(!user) return alert('Login to take quizzes')
    const userTaken = Array.isArray(user.quizzesTaken) ? user.quizzesTaken : []
    if(userTaken.includes(id)) return alert('You already took this quiz')

    let correct = 0
    quiz.questions.forEach((q, idx)=>{
      if(Number(answers[idx]) === Number(q.correctIndex)) correct++
    })

    const gained = correct * 10
    const updated = updateUserScore(user.id, gained)

    const users = loadUsers()
    const u = users.find(x=>x.id===user.id)
    if(u){
      u.quizzesTaken = u.quizzesTaken || []
      if(!u.quizzesTaken.includes(id)) u.quizzesTaken.push(id)
      saveUsers(users)
    }

    try{
      const bc = new BroadcastChannel('pqb_channel')
      bc.postMessage({ type: 'score_update', userId: user.id })
      bc.close()
    }catch(e){}

    setGainedScore(gained)
    setDone(true)
    refreshUser()
  }

  if(!quiz) return <div>Quiz not found — redirecting...</div>

  return (
    <div className='quiz-page'>
      <h2>{quiz.title}</h2>
      <p>{quiz.description}</p>
      {quiz.questions.map((q, idx)=> (
        <div key={idx} className='q-block'>
          <div className='q-text'>{idx+1}. {q.question}</div>
          <div className='choices'>
            {q.choices.map((c,ci)=> (
              <label key={ci} style={{display:'block'}}>
                <input
                  type='radio'
                  name={`q_${idx}`}
                  value={ci}
                  checked={Number(answers[idx]) === ci}
                  onChange={()=>pick(idx, ci)}
                /> {c}
              </label>
            ))}
          </div>
        </div>
      ))}
      {!done ? (
        <button onClick={submit}>Submit</button>
      ) : (
        <div className='result'>You scored {gainedScore} points</div>
      )}
    </div>
  )
}