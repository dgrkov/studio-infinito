using Microsoft.AspNetCore.Mvc;
using studio_infinito.DTOs;
using studio_infinito.Services;

namespace studio_infinito.Controllers
{
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
                return Ok(await _appointmentsService.InsertAppointment(appointmentDto));
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

    }
}
