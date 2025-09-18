import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function Hero(){
  const ref = useRef(null)

  useEffect(()=>{
    if(!ref.current) return
    const ctx = gsap.context(()=>{
      gsap.from('.hero-title', { y: 40, opacity:0, duration: 0.8, stagger: 0.12 })
      gsap.from('.hero-sub', { y: 20, opacity:0, duration: 0.6, delay: 0.2 })
    }, ref)

    return ()=> ctx.revert()
  },[])

  return (
    <section className="hero" ref={ref}>
      <h1 className="hero-title">Peer Quiz Battle</h1>
      <p className="hero-sub">Create quizzes, challenge peers, climb the leaderboard.</p>
    </section>
  )
}
