using MySql.Data.MySqlClient;
using studio_infinito.Data;
using studio_infinito.DTOs;
using studio_infinito.Events;
using System.Globalization;

namespace studio_infinito.Services.Implementation
{
    public class AppointmentsService : IAppointmentsService
    {
        DbContext _context;
        private readonly AppointmentService _appointmentService;

        public AppointmentsService(DbContext context, AppointmentService appointmentService)
        {
            _context = context;
            _appointmentService = appointmentService;
        }

        public async Task<List<Dictionary<string, object>>> GetAllServices()
        {
            try
            {
                return await _context.ExecuteSqlQuery("SELECT * FROM services");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> InsertAppointment(AppointmentDto appointmentDto)
        {
            try
            {
                DateTime appointmentDate = DateTime.ParseExact(appointmentDto.Event.Date, "dd-MM-yyyy", CultureInfo.InvariantCulture);
                TimeSpan appointmentTime = TimeSpan.Parse(appointmentDto.Event.Time);

                string query = @"INSERT INTO appointments (user_id, service_id, appointment_date, appointment_time, status, created_at)
                VALUES (@UserId, @ServiceId, @AppointmentDate, @AppointmentTime, @Status, NOW());";

                var parameters = new MySqlParameter[]
                {
                    new MySqlParameter("@UserId", MySqlDbType.Int32) { Value = 0 },
                    new MySqlParameter("@ServiceId", MySqlDbType.Int32) { Value = appointmentDto.AppointmentData.ServiceType.service_id },
                    new MySqlParameter("@AppointmentDate", MySqlDbType.DateTime) { Value = appointmentDate },
                    new MySqlParameter("@AppointmentTime", MySqlDbType.Time) { Value = appointmentTime },
                    new MySqlParameter("@Status", MySqlDbType.VarChar) { Value = "confirmed" }
                };

                // Execute the query
                var result = await _context.ExecuteSqlQuery(query, parameters);

                if (result.Any(r => r.ContainsKey("error")))
                {
                    string errorMessage = result.First(r => r.ContainsKey("error"))["error"].ToString();
                    throw new Exception(errorMessage);
                }
                else
                {
                    _appointmentService.CreateAppointment("nikpetrovski007@gmail.com", appointmentDto);
                    return true;
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error inserting appointment: " + ex.Message);
            }
        }

    }

}
