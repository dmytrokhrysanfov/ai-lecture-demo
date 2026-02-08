namespace RaceSimulatorAPI.Models;

public class Participant
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = string.Empty;
    public string Icon { get; set; } = "🏃";
    public double Position { get; set; } = 0.0;
    public double Velocity { get; set; } = 0.0;
    public bool IsWinner { get; set; } = false;
}
