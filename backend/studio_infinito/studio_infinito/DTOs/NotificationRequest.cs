namespace studio_infinito.DTOs
{
    public class NotificationRequest
    {
        public string DeviceToken { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
        public string iconUrl { get; set; }
    }

}
