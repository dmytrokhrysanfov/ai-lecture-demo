import React, { useState, useEffect, useRef } from 'react'
import ParticipantManager from './components/ParticipantManager'
import RaceTrack from './components/RaceTrack'
import Timer from './components/Timer'
import ResultsTable from './components/ResultsTable'
import { raceApi } from './services/api'
import './App.css'

function App() {
  const [participants, setParticipants] = useState([])
  const [raceState, setRaceState] = useState(null)
  const [durationSeconds, setDurationSeconds] = useState(60)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [isRaceRunning, setIsRaceRunning] = useState(false)
  const intervalRef = useRef(null)
  const startTimeRef = useRef(null)

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const handleAddParticipant = (name) => {
    if (name.trim() && !participants.includes(name.trim())) {
      setParticipants([...participants, name.trim()])
    }
  }

  const handleRemoveParticipant = (name) => {
    setParticipants(participants.filter(p => p !== name))
  }

  const handleClearParticipants = () => {
    setParticipants([])
  }

  const handleStartRace = async () => {
    if (participants.length === 0) {
      alert('Please add at least one participant')
      return
    }

    if (durationSeconds <= 0) {
      alert('Duration must be greater than zero')
      return
    }

    try {
      const response = await raceApi.createRace({
        participantNames: participants,
        durationSeconds: durationSeconds
      })

      const race = await raceApi.startRace(response.data.raceId)
      setRaceState(race.data)
      setIsRaceRunning(true)
      setElapsedTime(0)
      startTimeRef.current = Date.now()

      intervalRef.current = setInterval(async () => {
        try {
          const now = Date.now()
          const elapsed = (now - startTimeRef.current) / 1000

          if (elapsed >= durationSeconds) {
            setElapsedTime(durationSeconds)
            setIsRaceRunning(false)
            if (intervalRef.current) {
              clearInterval(intervalRef.current)
            }
            
            const finalRace = await raceApi.updateRace(response.data.raceId, durationSeconds)
            setRaceState(finalRace.data)
          } else {
            setElapsedTime(elapsed)
            const updatedRace = await raceApi.updateRace(response.data.raceId, elapsed)
            setRaceState(updatedRace.data)
          }
        } catch (error) {
          console.error('Error updating race:', error)
          setIsRaceRunning(false)
          if (intervalRef.current) {
            clearInterval(intervalRef.current)
          }
          alert('Error updating race: ' + (error.response?.data?.error || error.message))
        }
      }, 100)
    } catch (error) {
      console.error('Error starting race:', error)
      alert('Failed to start race: ' + (error.response?.data?.error || error.message))
    }
  }

  const handleResetRace = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setIsRaceRunning(false)
    setRaceState(null)
    setElapsedTime(0)
    startTimeRef.current = null
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏁 Custom Race Simulator</h1>
      </header>

      <div className="app-content">
        <div className="left-panel">
          <ParticipantManager
            participants={participants}
            onAdd={handleAddParticipant}
            onRemove={handleRemoveParticipant}
            onClear={handleClearParticipants}
            durationSeconds={durationSeconds}
            onDurationChange={setDurationSeconds}
            disabled={isRaceRunning}
          />
        </div>

        <div className="right-panel">
          <RaceTrack
            raceState={raceState}
            onStartRace={handleStartRace}
            onResetRace={handleResetRace}
            isRaceRunning={isRaceRunning}
            disabled={participants.length === 0}
          />

          {raceState && (
            <>
              <Timer
                elapsedTime={elapsedTime}
                durationSeconds={durationSeconds}
                isRunning={isRaceRunning}
              />

              {raceState.status === 'Finished' && raceState.results && (
                <ResultsTable results={raceState.results} />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
