import React, { useEffect, useState, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getQuizById, updateUserScore, loadUsers, saveUsers, createQuiz } from '../api/storage'
import { AuthContext } from '../context/AuthContext'

export default function QuizPage(){
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, refreshUser } = useContext(AuthContext)
  const [answers, setAnswers] = useState({})
  const [done, setDone] = useState(false)
  const [gainedScore, setGainedScore] = useState(0)
  const [quiz, setQuiz] = useState(null)

  // Create dummy quizzes if none exist
  useEffect(()=>{
    const existing = getQuizById(id)
    if(!existing){
      const dummy = createQuiz({
        title: 'Sample Quiz',
        description: 'This is a dummy quiz for testing.',
        questions: [
          { question: 'What is 2+2?', choices: ['3','4','5','6'], correctIndex: 1 },
          { question: 'Capital of France?', choices: ['Paris','London','Berlin','Rome'], correctIndex: 0 },
          { question: 'React is a?', choices: ['Library','Framework','Language','OS'], correctIndex: 0 },
        ],
        authorId: 'dummy'
      })
      setQuiz(dummy)
      return
    }
    setQuiz(existing)
  },[id])

  function pick(qi, choiceIdx){
    setAnswers(prev=>({ ...prev, [qi]: Number(choiceIdx) }))
  }

  function submit(){
    if(!user) return alert('Login to take quizzes')
    const userTaken = Array.isArray(user.quizzesTaken) ? user.quizzesTaken : []
    if(userTaken.includes(quiz.id)) return alert('You already took this quiz')

    let correct = 0
    quiz.questions.forEach((q, idx)=>{
      if(Number(answers[idx]) === Number(q.correctIndex)) correct++
    })

    const gained = correct * 10
    updateUserScore(user.id, gained)

    const users = loadUsers()
    const u = users.find(x=>x.id===user.id)
    if(u){
      u.quizzesTaken = u.quizzesTaken || []
      if(!u.quizzesTaken.includes(quiz.id)) u.quizzesTaken.push(quiz.id)
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

  if(!quiz) return <div className="page">Loading quiz...</div>

  return (
    <div className='quiz-page page'>
      <h2>{quiz.title}</h2>
      <p className="quiz-desc">{quiz.description}</p>
      {quiz.questions.map((q, idx)=> (
        <div key={idx} className='q-card'>
          <div className='q-text'>{idx+1}. {q.question}</div>
          <div className='choices'>
            {q.choices.map((c,ci)=> (
              <label key={ci} className="choice-label">
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
        <button className="btn-submit" onClick={submit}>Submit</button>
      ) : (
        <div className='result'>You scored {gainedScore} points</div>
      )}
    </div>
  )
}
