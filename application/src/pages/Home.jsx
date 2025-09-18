import React from 'react'
import Hero from '../components/Hero'

export default function Home(){
  return (
    <div className="home-page page">
      <Hero />
      <section className="features">
        <div className="feature-card">
          <h3>Create Quizzes</h3>
          <p>Design multiple-choice quizzes and challenge your peers.</p>
        </div>
        <div className="feature-card">
          <h3>Take Quizzes</h3>
          <p>Browse quizzes made by others and test your knowledge.</p>
        </div>
        <div className="feature-card">
          <h3>Leaderboard</h3>
          <p>Climb the leaderboard and earn rewards for your achievements.</p>
        </div>
      </section>
    </div>
  )
}
