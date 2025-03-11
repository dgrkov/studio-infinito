using Microsoft.AspNetCore.Mvc;
using studio_infinito.Data;
using studio_infinito.Services;

namespace studio_infinito.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CalendarController : Controller
    {
        ICalendarService _calendarService;

        public CalendarController(ICalendarService calendarService)
        {
            _calendarService = calendarService;
        }

        [HttpGet("available-dates")]
        public async Task<IActionResult> GetAvailableDates(int year, int month, int hairstylist_id, int service_id)
        {
            try
            {
                return Ok(await _calendarService.GetAvailableDates(year, month, hairstylist_id, service_id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("available-timeslots/{appointment_date}/{service_duration}/{hairstylist_id}")]
        public async Task<IActionResult> GetAvailableTimeSlots(string appointment_date, int service_duration, int hairstylist_id)
        {
            try
            {
                return Ok(await _calendarService.GetAvailableTimeSlots(appointment_date, service_duration, hairstylist_id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

    }
}
