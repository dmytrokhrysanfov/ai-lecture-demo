using RaceSimulatorAPI.Models;

namespace RaceSimulatorAPI.Services;

public class RaceService
{
    private readonly Dictionary<string, RaceState> _races = new();
    private readonly Random _random = new();
    private readonly string[] _icons = { "🚗", "🐎", "🐢", "🚀", "🏎️", "🦘", "🐆", "🦅", "🏃", "🚴" };

    public RaceState CreateRace(RaceRequest request)
    {
        if (request.ParticipantNames == null || request.ParticipantNames.Count == 0)
        {
            throw new ArgumentException("At least one participant is required.");
        }

        if (request.DurationSeconds <= 0)
        {
            throw new ArgumentException("Duration must be greater than zero.");
        }

        var raceState = new RaceState
        {
            DurationSeconds = request.DurationSeconds,
            FinishLineDistance = 100.0,
            Status = RaceStatus.NotStarted
        };

        for (int i = 0; i < request.ParticipantNames.Count; i++)
        {
            var participant = new Participant
            {
                Name = request.ParticipantNames[i],
                Icon = _icons[i % _icons.Length],
                Position = 0.0,
                Velocity = 0.0
            };
            raceState.Participants.Add(participant);
        }

        _races[raceState.RaceId] = raceState;
        return raceState;
    }

    public RaceState? GetRace(string raceId)
    {
        return _races.TryGetValue(raceId, out var race) ? race : null;
    }

    public RaceState StartRace(string raceId)
    {
        if (!_races.TryGetValue(raceId, out var race))
        {
            throw new KeyNotFoundException($"Race with ID {raceId} not found.");
        }

        if (race.Status != RaceStatus.NotStarted)
        {
            throw new InvalidOperationException("Race has already been started.");
        }

        if (race.Participants.Count == 0)
        {
            throw new InvalidOperationException("Cannot start race with no participants.");
        }

        race.Status = RaceStatus.Running;
        race.StartTime = DateTime.UtcNow;
        race.ElapsedTime = 0.0;
        race.PreviousElapsedTime = 0.0;

        var baseVelocity = race.FinishLineDistance / race.DurationSeconds;
        var winnerIndex = _random.Next(race.Participants.Count);
        race.WinnerId = race.Participants[winnerIndex].Id;
        race.Participants[winnerIndex].IsWinner = true;

        foreach (var participant in race.Participants)
        {
            var variation = 0.7 + (_random.NextDouble() * 0.6);
            participant.Velocity = baseVelocity * variation;
            participant.Position = 0.0;
        }

        return race;
    }

    public RaceState UpdateRace(string raceId, double elapsedTime)
    {
        if (!_races.TryGetValue(raceId, out var race))
        {
            throw new KeyNotFoundException($"Race with ID {raceId} not found.");
        }

        if (race.Status != RaceStatus.Running)
        {
            return race;
        }

        var deltaTime = elapsedTime - race.PreviousElapsedTime;
        if (deltaTime <= 0) deltaTime = 0.1;
        
        race.PreviousElapsedTime = race.ElapsedTime;
        race.ElapsedTime = elapsedTime;
        var progress = elapsedTime / race.DurationSeconds;
        var remainingTime = race.DurationSeconds - elapsedTime;
        var riggedThreshold = 0.9;

        if (progress >= 1.0)
        {
            FinishRace(race);
            return race;
        }

        var winner = race.Participants.FirstOrDefault(p => p.Id == race.WinnerId);
        if (winner == null)
        {
            throw new InvalidOperationException("Winner participant not found.");
        }

        if (progress >= riggedThreshold)
        {
            var remainingDistance = race.FinishLineDistance - winner.Position;
            var timeRemaining = remainingTime;
            
            if (timeRemaining > 0)
            {
                winner.Velocity = remainingDistance / timeRemaining;
            }
            else
            {
                winner.Velocity = 0;
            }
        }

        // Calculate maximum allowed position based on elapsed time to prevent early finishes
        // No participant should reach the finish line before the race duration ends
        // Only apply this cap before the rigged threshold to allow the rigged finish to work
        var maxAllowedPosition = race.FinishLineDistance;
        if (progress < riggedThreshold)
        {
            maxAllowedPosition = (elapsedTime / race.DurationSeconds) * race.FinishLineDistance;
        }

        foreach (var participant in race.Participants)
        {
            if (participant.Position < race.FinishLineDistance)
            {
                participant.Position += participant.Velocity * deltaTime;
                
                // Cap position to ensure no one finishes before the race duration ends
                // Exception: winner can exceed this during rigged phase
                if (progress < riggedThreshold || participant.Id != race.WinnerId)
                {
                    if (participant.Position > maxAllowedPosition)
                    {
                        participant.Position = maxAllowedPosition;
                    }
                }
                
                // Always cap at finish line distance
                if (participant.Position > race.FinishLineDistance)
                {
                    participant.Position = race.FinishLineDistance;
                }
            }
        }

        return race;
    }

    private void FinishRace(RaceState race)
    {
        race.Status = RaceStatus.Finished;
        
        var winner = race.Participants.FirstOrDefault(p => p.Id == race.WinnerId);
        if (winner != null)
        {
            winner.Position = race.FinishLineDistance;
        }

        foreach (var participant in race.Participants)
        {
            if (participant.Position < race.FinishLineDistance)
            {
                participant.Position = race.FinishLineDistance;
            }
        }

        var sortedParticipants = race.Participants
            .OrderByDescending(p => p.Position)
            .ThenBy(p => p.IsWinner ? 0 : 1)
            .ToList();

        race.Results.Clear();
        for (int i = 0; i < sortedParticipants.Count; i++)
        {
            var participant = sortedParticipants[i];
            var finishTime = participant.Velocity > 0 
                ? race.ElapsedTime 
                : race.DurationSeconds;
            
            race.Results.Add(new RaceResult
            {
                ParticipantId = participant.Id,
                ParticipantName = participant.Name,
                Icon = participant.Icon,
                Place = i + 1,
                FinishTime = finishTime,
                FinalPosition = participant.Position
            });
        }
    }

    public void ClearRace(string raceId)
    {
        _races.Remove(raceId);
    }
}
