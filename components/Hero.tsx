'use client'

import './Hero.css'

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">
            Join the Future of
            <span className="hero-highlight"> Career Development</span>
          </h1>
          <p className="hero-description">
            Be among the first to experience Jurni's revolutionary platform that transforms how people build their careers. 
            Sign up for early access and exclusive updates.
          </p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Already Joined</span>
            </div>
            <div className="stat">
              <span className="stat-number">Launch</span>
              <span className="stat-label">Coming Soon</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
