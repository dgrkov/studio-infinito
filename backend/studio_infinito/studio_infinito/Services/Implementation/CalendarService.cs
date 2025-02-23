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

        public async Task<List<Dictionary<string, object>>> GetAvailableDates(int year, int month)
        {
            try
            {
                var parameters = new Dictionary<string, object>();
                parameters.Add("input_year", year);
                parameters.Add("input_month", month);

                return await _context.ExecuteStoredProcedure("GetAvailableDates", parameters);
            }
            catch (Exception ex)
            {
                return new List<Dictionary<string, object>> { new Dictionary<string, object> { ["error"] = $"Error executing stored procedure GetAvailableDates: {ex.Message}" } };
            }
        }

        public async Task<List<Dictionary<string, object>>> GetAvailableTimeSlots(string appointment_date, int service_duration)
        {
            try
            {
                var parameters = new Dictionary<string, object>();
                parameters.Add("appointment_date", appointment_date);
                parameters.Add("service_duration", service_duration);

                return await _context.ExecuteStoredProcedure("GetAvailableTimeSlots", parameters);
            }
            catch (Exception ex)
            {
                return new List<Dictionary<string, object>> { new Dictionary<string, object> { ["error"] = $"Error executing stored procedure GetAvailableTimeSlots: {ex.Message}" } };
            }
        }

    }
}
