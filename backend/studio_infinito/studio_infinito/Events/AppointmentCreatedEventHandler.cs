using studio_infinito.DTOs;

namespace studio_infinito.Events
{
    public delegate void AppointmentCreatedEventHandler(object sender, AppointmentEventArgs e);

    public class AppointmentEventArgs : EventArgs
    {
        public string UserEmail { get; set; }
        public AppointmentDto AppointmentDetails { get; set; }
    }

    public class AppointmentService
    {
        public event AppointmentCreatedEventHandler AppointmentCreated;

        public void CreateAppointment(AppointmentDto appointmentDetails)
        {
            OnAppointmentCreated(appointmentDetails);
        }

        // Protected method to raise the event
        protected virtual void OnAppointmentCreated(AppointmentDto appointmentDetails)
        {
            AppointmentCreated?.Invoke(this, new AppointmentEventArgs
            {
                UserEmail = appointmentDetails.UserEmail,
                AppointmentDetails = appointmentDetails
            });
        }
    }
}
