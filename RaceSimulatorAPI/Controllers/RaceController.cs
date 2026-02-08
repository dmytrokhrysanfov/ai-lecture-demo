using Microsoft.AspNetCore.Mvc;
using RaceSimulatorAPI.Models;
using RaceSimulatorAPI.Services;

namespace RaceSimulatorAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RaceController : ControllerBase
{
    private readonly RaceService _raceService;

    public RaceController(RaceService raceService)
    {
        _raceService = raceService;
    }

    [HttpPost("create")]
    public IActionResult CreateRace([FromBody] RaceRequest request)
    {
        try
        {
            var race = _raceService.CreateRace(request);
            return Ok(race);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"An error occurred: {ex.Message}" });
        }
    }

    [HttpGet("{raceId}")]
    public IActionResult GetRace(string raceId)
    {
        try
        {
            var race = _raceService.GetRace(raceId);
            if (race == null)
            {
                return NotFound(new { error = "Race not found" });
            }
            return Ok(race);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"An error occurred: {ex.Message}" });
        }
    }

    [HttpPost("{raceId}/start")]
    public IActionResult StartRace(string raceId)
    {
        try
        {
            var race = _raceService.StartRace(raceId);
            return Ok(race);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"An error occurred: {ex.Message}" });
        }
    }

    [HttpPost("{raceId}/update")]
    public IActionResult UpdateRace(string raceId, [FromBody] UpdateRaceRequest request)
    {
        try
        {
            var race = _raceService.UpdateRace(raceId, request.ElapsedTime);
            return Ok(race);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"An error occurred: {ex.Message}" });
        }
    }

    [HttpDelete("{raceId}")]
    public IActionResult ClearRace(string raceId)
    {
        try
        {
            _raceService.ClearRace(raceId);
            return Ok(new { message = "Race cleared successfully" });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = $"An error occurred: {ex.Message}" });
        }
    }
}

public class UpdateRaceRequest
{
    public double ElapsedTime { get; set; }
}
