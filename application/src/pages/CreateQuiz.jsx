import React, { useState, useContext } from 'react'
import { createQuiz, loadUsers, saveUsers } from '../api/storage'
import { AuthContext } from '../context/AuthContext'

export default function CreateQuiz(){
  const { user, refreshUser } = useContext(AuthContext)
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [questions, setQuestions] = useState([
    {id:1, question:'', choices:['','','',''], correctIndex:0},
    {id:2, question:'', choices:['','','',''], correctIndex:0},
    {id:3, question:'', choices:['','','',''], correctIndex:0},
  ])
  const [error, setError] = useState(null)

  function addQuestion(){
    setQuestions(qs=>[...qs, {id:Date.now(), question:'', choices:['','','',''], correctIndex:0}])
  }

  function updateQuestion(index, partial){
    setQuestions(prev=>{
      const copy = prev.map(q=>({ ...q }))
      copy[index] = { ...copy[index], ...partial }
      return copy
    })
  }

  function onSubmit(e){
    e.preventDefault()
    setError(null)
    if(!user) return setError('You must be logged in')
    if(String(title || '').trim().length===0) return setError('Add a title')
    if(questions.length < 3) return setError('Add at least 3 questions')

    const final = questions.map(q=>({ question: String(q.question||''), choices: q.choices.map(c=>String(c||'')), correctIndex: Number(q.correctIndex) }))

    const q = createQuiz({ title: title.trim(), description: desc, questions: final, authorId: user.id })

    const users = loadUsers()
    const u = users.find(x=>x.id===user.id)
    if(u){
      u.quizzesCreated = u.quizzesCreated || []
      u.quizzesCreated.push(q.id)
      saveUsers(users)
      refreshUser()
    }

    setTitle('')
    setDesc('')
    setQuestions([
      {id:Date.now()+1, question:'', choices:['','','',''], correctIndex:0},
      {id:Date.now()+2, question:'', choices:['','','',''], correctIndex:0},
      {id:Date.now()+3, question:'', choices:['','','',''], correctIndex:0},
    ])

    alert('Quiz created!')
  }

  return (
    <div className="create-quiz page">
      <h2>Create a New Quiz</h2>
      <form onSubmit={onSubmit}>
        <input className="quiz-input" placeholder='Quiz Title' value={title} onChange={e=>setTitle(e.target.value)} />
        <textarea className="quiz-input" placeholder='Quiz Description' value={desc} onChange={e=>setDesc(e.target.value)} />

        {questions.map((q, idx)=> (
          <div className='question-card' key={q.id}>
            <input className="quiz-input" placeholder={`Question ${idx+1}`} value={q.question} onChange={e=>updateQuestion(idx, { question: e.target.value })} />
            {q.choices.map((c,ci)=> (
              <input key={ci} className="quiz-input" placeholder={`Choice ${ci+1}`} value={c} onChange={e=>{
                const newChoices = [...q.choices]
                newChoices[ci] = e.target.value
                updateQuestion(idx, { choices: newChoices })
              }} />
            ))}
            <label className="correct-label">
              Correct Choice:
              <select value={q.correctIndex} onChange={e=>updateQuestion(idx, { correctIndex: Number(e.target.value) })}>
                <option value={0}>1</option>
                <option value={1}>2</option>
                <option value={2}>3</option>
                <option value={3}>4</option>
              </select>
            </label>
          </div>
        ))}

        <div className="quiz-btns">
          <button type='button' onClick={addQuestion}>Add Question</button>
          <button type='submit'>Create Quiz</button>
        </div>
        {error && <div className='error'>{error}</div>}
      </form>
    </div>
  )
}
