namespace RaceSimulatorAPI.Models;

public class RaceResult
{
    public string ParticipantId { get; set; } = string.Empty;
    public string ParticipantName { get; set; } = string.Empty;
    public string Icon { get; set; } = "🏃";
    public int Place { get; set; }
    public double FinishTime { get; set; }
    public double FinalPosition { get; set; }
}
