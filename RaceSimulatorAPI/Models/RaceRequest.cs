namespace RaceSimulatorAPI.Models;

public class RaceRequest
{
    public List<string> ParticipantNames { get; set; } = new();
    public int DurationSeconds { get; set; } = 60;
}
