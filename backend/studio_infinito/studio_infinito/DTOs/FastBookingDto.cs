namespace studio_infinito.DTOs
{
    public class FastBookingDto
    {
        public HairstylistDto hairstylist { get; set; }
        public ServiceTypeDto serviceType { get; set; }
        public int page_number { get; set; }
        public int page_size { get; set; }
    }
}
