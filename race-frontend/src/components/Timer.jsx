import React from 'react'
import './Timer.css'

function Timer({ elapsedTime, durationSeconds, isRunning }) {
  const remainingTime = Math.max(0, durationSeconds - elapsedTime)
  const minutes = Math.floor(remainingTime / 60)
  const seconds = Math.floor(remainingTime % 60)
  const milliseconds = Math.floor((remainingTime % 1) * 100)

  const formatTime = (value) => value.toString().padStart(2, '0')

  const progress = (elapsedTime / durationSeconds) * 100

  return (
    <div className="timer-container">
      <div className="timer-display">
        <span className="timer-time">
          {formatTime(minutes)}:{formatTime(seconds)}.{formatTime(milliseconds)}
        </span>
        {isRunning && <span className="timer-status">Running...</span>}
        {!isRunning && elapsedTime > 0 && <span className="timer-status finished">Finished!</span>}
      </div>
      <div className="timer-progress-bar">
        <div
          className="timer-progress-fill"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  )
}

export default Timer
