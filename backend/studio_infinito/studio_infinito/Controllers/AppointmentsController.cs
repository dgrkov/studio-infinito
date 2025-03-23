using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using studio_infinito.DTOs;
using studio_infinito.Services;
using System.Diagnostics.Eventing.Reader;

namespace studio_infinito.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : Controller
    {
        IAppointmentsService _appointmentsService;

        public AppointmentsController(IAppointmentsService appointmentsService)
        {
            _appointmentsService = appointmentsService;
        }

        [HttpGet("get-services")]
        public async Task<IActionResult> Index()
        {
            try
            {
                return Ok(await _appointmentsService.GetAllServices());
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost("confirm-appointment")]
        public async Task<IActionResult> ConfirmAppointment([FromBody] AppointmentDto appointmentDto)
        {
            try
            {
                bool appointment_reserved = await _appointmentsService.InsertAppointment(appointmentDto);

                if (appointment_reserved)
                    return Ok(new Dictionary<string, string>() { { "status", "success" }, { "message", "Успешно резервирање на термин." } });
                else
                    return Ok(new Dictionary<string, string>() { { "status", "warning" }, { "message", "Терминот веќе е резервиран." } });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [EnableRateLimiting("fixed")]
        [HttpPost("user-appointments/{id}")]
        public async Task<IActionResult> UserAppointments(int id)
        {
            try
            {
                return Ok(await _appointmentsService.UserAppointments(id));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [EnableRateLimiting("fixed")]
        [HttpPost("fast-booking")]
        public async Task<IActionResult> FastBooking([FromBody] FastBookingDto fastBookingDto)
        {
            try
            {
                return Ok(await _appointmentsService.FastBooking(fastBookingDto));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

    }
}
