using System.Threading.Tasks;

namespace studio_infinito.Services
{
    public interface ICalendarService
    {
        Task<List<Dictionary<string, object>>> GetAvailableDates(int year, int month);
        Task<List<Dictionary<string, object>>> GetAvailableTimeSlots(string appointment_date, int service_duration);
    }
}
