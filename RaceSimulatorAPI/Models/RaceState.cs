namespace RaceSimulatorAPI.Models;

public class RaceState
{
    public string RaceId { get; set; } = Guid.NewGuid().ToString();
    public List<Participant> Participants { get; set; } = new();
    public RaceStatus Status { get; set; } = RaceStatus.NotStarted;
    public int DurationSeconds { get; set; } = 60;
    public double ElapsedTime { get; set; } = 0.0;
    public double PreviousElapsedTime { get; set; } = 0.0;
    public string? WinnerId { get; set; }
    public List<RaceResult> Results { get; set; } = new();
    public DateTime StartTime { get; set; }
    public double FinishLineDistance { get; set; } = 100.0;
}

public enum RaceStatus
{
    NotStarted,
    Running,
    Finished
}
