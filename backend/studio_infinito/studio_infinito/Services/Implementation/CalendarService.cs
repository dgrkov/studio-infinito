using studio_infinito.Data;

namespace studio_infinito.Services.Implementation
{
    public class CalendarService : ICalendarService
    {
        DbContext _context;

        public CalendarService(DbContext context)
        {
            _context = context;
        }

        public async Task<List<Dictionary<string, object>>> GetAvailableDates()
        {
            try
            {
                return _context.ExecuteStoredProcedure("GetAvailableDates");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
