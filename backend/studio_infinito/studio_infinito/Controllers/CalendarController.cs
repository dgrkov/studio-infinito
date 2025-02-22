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
        public IActionResult GetAvailableDates(int year, int month)
        {
            return Ok(_calendarService.GetAvailableDates(year, month));
        }

        [HttpGet("available-timeslots/{appointment_date}/{service_duration}")]
        public IActionResult GetAvailableTimeSlots(string appointment_date, int service_duration)
        {
            return Ok(_calendarService.GetAvailableTimeSlots(appointment_date, service_duration));
        }

    }
}
