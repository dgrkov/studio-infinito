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

                using (var transaction = await _context.BeginTransactionAsync()) // Manual transaction
                {
                    try
                    {
                        // Lock the appointment time slot
                        string lockQuery = "SELECT * FROM appointments WHERE appointment_date = @AppointmentDate AND appointment_time = @AppointmentTime AND hairstylist_id = @HairstylistId FOR UPDATE;";

                        var checkParameters = new MySqlParameter[]
                        {
                    new MySqlParameter("@AppointmentDate", MySqlDbType.DateTime) { Value = appointmentDate },
                    new MySqlParameter("@AppointmentTime", MySqlDbType.Time) { Value = appointmentTime },
                    new MySqlParameter("@HairstylistId", MySqlDbType.Int32) { Value = appointmentDto.AppointmentData.Hairstylist.hairstylist_id }
                        };

                        var existingAppointments = await _context.ExecuteSqlQuery(lockQuery, checkParameters);
                        int appointmentCount = Convert.ToInt32(existingAppointments.FirstOrDefault()?.Values.FirstOrDefault() ?? 0);

                        if (appointmentCount > 0)
                        {
                            await transaction.RollbackAsync();
                            return false;
                        }

                        // Insert the appointment
                        string insertQuery = @"INSERT INTO appointments (user_id, service_id, appointment_date, appointment_time, status, created_at, hairstylist_id)
                                       VALUES (@UserId, @ServiceId, @AppointmentDate, @AppointmentTime, @Status, NOW(), @HairstylistId);";

                        var insertParameters = new MySqlParameter[]
                        {
                            new MySqlParameter("@UserId", MySqlDbType.Int32) { Value = appointmentDto.user_id },
                            new MySqlParameter("@ServiceId", MySqlDbType.Int32) { Value = appointmentDto.AppointmentData.ServiceType.service_id },
                            new MySqlParameter("@AppointmentDate", MySqlDbType.DateTime) { Value = appointmentDate },
                            new MySqlParameter("@AppointmentTime", MySqlDbType.Time) { Value = appointmentTime },
                            new MySqlParameter("@Status", MySqlDbType.VarChar) { Value = "confirmed" },
                            new MySqlParameter("@HairstylistId", MySqlDbType.Int32) { Value = appointmentDto.AppointmentData.Hairstylist.hairstylist_id }
                        };

                        await _context.ExecuteSqlQuery(insertQuery, insertParameters);

                        await transaction.CommitAsync();

                        var user = await _context.ExecuteSqlQuery("SELECT * FROM users WHERE user_id = @UserId", new MySqlParameter[] { new MySqlParameter("@UserId", MySqlDbType.Int32) { Value = appointmentDto.user_id } });

                        if (user.Count > 0)
                        {
                            appointmentDto.UserEmail = user[0]["email"].ToString();
                            appointmentDto.UserPhone = user[0]["phone"].ToString();
                            appointmentDto.UserName = user[0]["full_name"].ToString();
                            appointmentDto.firebaseToken = user[0]["firebase_token"].ToString();
                        }

                        _appointmentService.CreateAppointment(appointmentDto);

                        return true;
                    }
                    catch
                    {
                        await transaction.RollbackAsync();
                        throw;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new Exception("Error inserting appointment: " + ex.Message);
            }
        }

        public async Task<List<Dictionary<string, object>>> UserAppointments(int id)
        {
            try {
                return await _context.ExecuteSqlQuery(
                    "SELECT * FROM users AS us " +
                    "LEFT JOIN appointments AS ap ON us.user_id = ap.user_id " +
                    "LEFT JOIN services AS sr ON sr.service_id = ap.service_id " +
                    "WHERE us.user_id = @UserId;",
                    new MySqlParameter[] {
                        new MySqlParameter("@UserId", MySqlDbType.Int32) { Value = id }
                    });
            }
            catch (Exception ex)
            {
                throw new Exception("Error finding user appointments: " + ex.Message);
            }
        }

        public async Task<List<Dictionary<string, object>>> FastBooking(FastBookingDto fastBookingDto)
        {
            try
            {
                var parameters = new Dictionary<string, object>();
                parameters.Add("page_number", fastBookingDto.page_number);
                parameters.Add("page_size", fastBookingDto.page_size);
                parameters.Add("service_id_param", fastBookingDto?.serviceType?.service_id ?? 0);
                parameters.Add("hairstylist_id_param", fastBookingDto?.hairstylist?.hairstylist_id ?? 1);

                return await _context.ExecuteStoredProcedure("GetFastestAppointments", parameters);
            }
            catch (Exception ex)
            {
                return new List<Dictionary<string, object>> { new Dictionary<string, object> { ["error"] = $"Error executing stored procedure GetAvailableDates: {ex.Message}" } };
            }
        }
    }

}
