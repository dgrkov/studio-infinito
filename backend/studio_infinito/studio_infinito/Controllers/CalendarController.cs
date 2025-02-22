using Microsoft.AspNetCore.Mvc;
using studio_infinito.Data;
using studio_infinito.Services;

namespace studio_infinito.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CalendarController : Controller
    {
        ICalendarService _calendarService;

        public CalendarController(ICalendarService calendarService)
        {
            _calendarService = calendarService;
        }

        [HttpGet("available-dates")]
        public IActionResult GetAvailableDates()
        {
            return Ok(_calendarService.GetAvailableDates());
        }
    }
}
