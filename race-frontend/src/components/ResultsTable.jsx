import React from 'react'
import './ResultsTable.css'

function ResultsTable({ results }) {
  const getPlaceEmoji = (place) => {
    switch (place) {
      case 1: return '🥇'
      case 2: return '🥈'
      case 3: return '🥉'
      default: return `${place}th`
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = (seconds % 60).toFixed(2)
    return mins > 0 ? `${mins}:${secs.padStart(5, '0')}` : `${secs}s`
  }

  return (
    <div className="results-table-container">
      <h2>Race Results</h2>
      <table className="results-table">
        <thead>
          <tr>
            <th>Place</th>
            <th>Icon</th>
            <th>Name</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.participantId} className={result.place === 1 ? 'winner' : ''}>
              <td className="place-cell">
                <span className="place-emoji">{getPlaceEmoji(result.place)}</span>
                <span className="place-number">{result.place}</span>
              </td>
              <td className="icon-cell">
                <span className="result-icon">{result.icon}</span>
              </td>
              <td className="name-cell">{result.participantName}</td>
              <td className="time-cell">{formatTime(result.finishTime)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ResultsTable
