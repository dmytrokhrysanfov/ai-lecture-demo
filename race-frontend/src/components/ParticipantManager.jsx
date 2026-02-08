import React, { useState } from 'react'
import './ParticipantManager.css'

function ParticipantManager({ participants, onAdd, onRemove, onClear, durationSeconds, onDurationChange, disabled }) {
  const [inputValue, setInputValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (inputValue.trim()) {
      onAdd(inputValue.trim())
      setInputValue('')
    }
  }

  return (
    <div className="participant-manager">
      <h2>Participants</h2>

      <form onSubmit={handleSubmit} className="participant-form">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter participant name"
          disabled={disabled}
          className="participant-input"
        />
        <button type="submit" disabled={disabled || !inputValue.trim()} className="add-button">
          Add
        </button>
      </form>

      <div className="participant-list">
        {participants.length === 0 ? (
          <p className="empty-message">No participants added yet</p>
        ) : (
          participants.map((name, index) => (
            <div key={index} className="participant-item">
              <span className="participant-name">{name}</span>
              <button
                onClick={() => onRemove(name)}
                disabled={disabled}
                className="remove-button"
                title="Remove participant"
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>

      {participants.length > 0 && (
        <button
          onClick={onClear}
          disabled={disabled}
          className="clear-button"
        >
          Clear All
        </button>
      )}

      <div className="duration-control">
        <label htmlFor="duration">Race Duration (seconds):</label>
        <input
          id="duration"
          type="number"
          min="10"
          max="300"
          value={durationSeconds}
          onChange={(e) => onDurationChange(parseInt(e.target.value) || 60)}
          disabled={disabled}
          className="duration-input"
        />
      </div>
    </div>
  )
}

export default ParticipantManager
