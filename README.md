# Custom Race Simulator

A web-based race simulation application with a rigged finish system where a randomly selected participant always wins at the final 10% of the race duration.

## Features

- **Participant Management**: Add, remove, or clear participants from the race
- **Adjustable Timer**: Set race duration before starting (10-300 seconds)
- **Animated Race Track**: Visual representation of racers moving across a horizontal track
- **Rigged Finish Logic**: At 90% of the race duration, a randomly selected participant accelerates to win
- **Live Timer**: Real-time countdown display with progress bar
- **Results Table**: Displays final rankings with place, icon, name, and finish time

## Technology Stack

### Backend
- **.NET 8.0** - C# Web API
- **ASP.NET Core** - Web framework

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Axios** - HTTP client

## Project Structure

```
.
├── RaceSimulatorAPI/          # C# Web API backend
│   ├── Controllers/          # API endpoints
│   ├── Models/               # Data models
│   ├── Services/             # Business logic
│   └── Program.cs           # Application entry point
├── race-frontend/            # React frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service
│   │   └── App.jsx          # Main app component
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- .NET 8.0 SDK
- Node.js 18+ and npm

### Backend Setup

1. Navigate to the backend directory:
```bash
cd RaceSimulatorAPI
```

2. Restore dependencies and run:
```bash
dotnet restore
dotnet run
```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd race-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

- `POST /api/race/create` - Create a new race
- `GET /api/race/{raceId}` - Get race status
- `POST /api/race/{raceId}/start` - Start the race
- `POST /api/race/{raceId}/update` - Update race progress
- `DELETE /api/race/{raceId}` - Clear race

## How It Works

1. **Race Creation**: Participants are added with unique icons (car, horse, turtle, etc.)
2. **Race Start**: Each participant gets a random base velocity (70-130% of average speed)
3. **Race Progress**: Participants move at their assigned velocities
4. **Rigged Finish**: At 90% of the race duration:
   - The randomly selected winner's velocity is recalculated
   - The winner's new velocity ensures they cross the finish line exactly when the timer reaches 00:00
   - Formula: `velocity = remaining_distance / remaining_time`
5. **Race Finish**: All participants are ranked by final position, with the winner guaranteed first place

## Mathematical Soundness

The rigged finish algorithm ensures mathematical precision:
- At the 90% threshold, the winner's remaining distance is calculated
- The winner's velocity is recalculated to: `v = (finish_line_distance - current_position) / remaining_time`
- This guarantees the winner crosses the finish line exactly when `elapsed_time = duration_seconds`

## Error Handling

The application includes robust error handling for:
- Invalid race requests (no participants, invalid duration)
- Race state validation (cannot start finished race, etc.)
- API communication errors
- Network failures

## License

This project is open source and available for educational purposes.
