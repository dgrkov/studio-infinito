using System.Threading.Tasks;

namespace studio_infinito.Services
{
    public interface ICalendarService
    {
        Task<List<Dictionary<string, object>>> GetAvailableDates(int year, int month, int hairstylist_id, int service_id);
        Task<List<Dictionary<string, object>>> GetAvailableTimeSlots(string appointment_date, int service_duration, int hairstylist_id);
    }
}
