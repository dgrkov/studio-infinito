using studio_infinito.DTOs;

namespace studio_infinito.Services
{
    public interface IAppointmentsService
    {
        Task<List<Dictionary<string, object>>> GetAllServices();
        Task<bool> InsertAppointment(AppointmentDto appointmentDto);
        Task<List<Dictionary<string, object>>> UserAppointments(int id);
        Task<List<Dictionary<string, object>>> FastBooking(FastBookingDto fastBookingDto);
    }
}
