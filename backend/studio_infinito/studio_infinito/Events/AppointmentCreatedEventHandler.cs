using studio_infinito.DTOs;
using System;

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

        public void CreateAppointment(string userEmail, AppointmentDto appointmentDetails)
        {
            OnAppointmentCreated(userEmail, appointmentDetails);
        }

        // Protected method to raise the event
        protected virtual void OnAppointmentCreated(string userEmail, AppointmentDto appointmentDetails)
        {
            AppointmentCreated?.Invoke(this, new AppointmentEventArgs
            {
                UserEmail = userEmail,
                AppointmentDetails = appointmentDetails
            });
        }
    }
}
