namespace studio_infinito.DTOs
{
    public class EventDto
    {
        public string Date { get; set; }  // Consider using DateTime if you can control the format
        public string Title { get; set; }
        public string Time { get; set; }  // Consider using TimeSpan if dealing with time values
    }
}
