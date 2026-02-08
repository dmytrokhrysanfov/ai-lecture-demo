import React from 'react'
import './RaceTrack.css'

function RaceTrack({ raceState, onStartRace, onResetRace, isRaceRunning, disabled }) {
  const finishLineDistance = raceState?.finishLineDistance || 100

  return (
    <div className="race-track-container">
      <div className="race-track">
        {raceState && raceState.participants ? (
          <>
            {raceState.participants.map((participant) => {
              const percentage = Math.min((participant.position / finishLineDistance) * 100, 100)
              // Ensure racer doesn't go beyond track bounds, accounting for name width
              const maxLeft = 95 // Leave 5% for name visibility
              const adjustedPercentage = Math.min(percentage, maxLeft)
              return (
                <div key={participant.id} className="racer-lane">
                  <div
                    className="racer"
                    style={{
                      left: `${adjustedPercentage}%`,
                      transition: isRaceRunning ? 'left 0.1s linear' : 'none'
                    }}
                  >
                    <span className="racer-icon">{participant.icon}</span>
                    <span className="racer-name" title={participant.name} style={{ color: '#333' }}>
                      {participant.name}
                    </span>
                  </div>
                </div>
              )
            })}
            <div className="finish-line" />
          </>
        ) : (
          <div className="empty-track">
            <p>Add participants and start the race!</p>
          </div>
        )}

        <div className="race-controls">
          {!isRaceRunning && !raceState && (
            <button
              onClick={onStartRace}
              disabled={disabled}
              className="start-race-button"
            >
              🏁 Start Race
            </button>
          )}
          {raceState && !isRaceRunning && (
            <button
              onClick={onResetRace}
              className="reset-race-button"
            >
              🔄 Reset Race
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default RaceTrack
