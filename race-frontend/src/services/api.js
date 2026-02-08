import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api/race'

export const raceApi = {
  createRace: async (request) => {
    return await axios.post(`${API_BASE_URL}/create`, request)
  },

  getRace: async (raceId) => {
    return await axios.get(`${API_BASE_URL}/${raceId}`)
  },

  startRace: async (raceId) => {
    return await axios.post(`${API_BASE_URL}/${raceId}/start`)
  },

  updateRace: async (raceId, elapsedTime) => {
    return await axios.post(`${API_BASE_URL}/${raceId}/update`, { elapsedTime })
  },

  clearRace: async (raceId) => {
    return await axios.delete(`${API_BASE_URL}/${raceId}`)
  }
}
