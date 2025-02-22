using System.Threading.Tasks;

namespace studio_infinito.Services
{
    public interface ICalendarService
    {
        Task<List<Dictionary<string, object>>> GetAvailableDates();
    }
}
