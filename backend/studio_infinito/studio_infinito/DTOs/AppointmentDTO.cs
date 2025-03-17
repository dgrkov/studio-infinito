namespace studio_infinito.DTOs
{
    public class AppointmentDto
    {
        public EventDto Event { get; set; }
        public AppointmentDataDto AppointmentData { get; set; }
        public int user_id { get; set; }
        public string? UserEmail { get; set; }
        public string? UserPhone { get; set; }
    }
}
