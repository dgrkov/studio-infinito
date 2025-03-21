﻿using studio_infinito.DTOs;
using System;
using System.IO;
using System.Net.Mail;
using System.Net;
using System.Threading.Tasks;
using System.Text;
using Microsoft.Extensions.Configuration;  // Ensure this is imported

namespace studio_infinito.Events
{
    public class AppointmentCreatedEvent
    {

        public AppointmentCreatedEvent(AppointmentService appointmentService)
        {
            appointmentService.AppointmentCreated += async (sender, e) => await HandleAppointmentCreated(sender, e);
        }

        private async Task HandleAppointmentCreated(object sender, AppointmentEventArgs e)
        {
            try
            {
                await SendEmail(e.AppointmentDetails);
                SendViberMessage(e.AppointmentDetails);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error in handler: {ex}");
            }
        }

        private async Task SendEmail(AppointmentDto appointmentDto)
        {
            try
            {
                IConfiguration configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json")
                .Build();

                var bodyBuilder = new StringBuilder();
                bodyBuilder.AppendLine("<html>");
                bodyBuilder.AppendLine("<head>");
                bodyBuilder.AppendLine("<style>");
                bodyBuilder.AppendLine("body { font-family: Arial, sans-serif; color: #333; }");
                bodyBuilder.AppendLine(".container { max-width: 600px; padding: 20px; background-color: #f9f9f9; border-radius: 10px; }");
                bodyBuilder.AppendLine(".details-table { width: 100%; border-collapse: collapse; margin-top: 10px; }");
                bodyBuilder.AppendLine(".details-table td { padding: 8px; border-bottom: 1px solid #ddd; }");
                bodyBuilder.AppendLine(".details-table td:first-child { font-weight: bold; }");
                bodyBuilder.AppendLine("</style>");
                bodyBuilder.AppendLine("</head>");
                bodyBuilder.AppendLine("<body>");
                bodyBuilder.AppendLine("<div class='container'>");
                bodyBuilder.AppendLine("<p>Почитуван(а) Nikola,</p>");
                bodyBuilder.AppendLine("<p>Вашата резервација е успешно направена!</p>");
                bodyBuilder.AppendLine("<p><strong>Еве ги деталите за вашиот закажан термин:</strong></p>");

                bodyBuilder.AppendLine("<table class='details-table'>");
                bodyBuilder.AppendLine($"<tr><td>📅 Датум:</td><td>{appointmentDto.Event.Date}</td></tr>");
                bodyBuilder.AppendLine($"<tr><td>⏰ Време:</td><td>{DateTime.Parse(appointmentDto.Event.Time).ToString("HH:mm")}</td></tr>");
                bodyBuilder.AppendLine($"<tr><td>💇‍♂️ Фризер:</td><td>{appointmentDto.AppointmentData.Hairstylist.Hairstylist}</td></tr>");
                bodyBuilder.AppendLine($"<tr><td>🔹 Услуга:</td><td>{appointmentDto.AppointmentData.ServiceType.Name}</td></tr>");
                bodyBuilder.AppendLine($"<tr><td>💰 Цена:</td><td>{appointmentDto.AppointmentData.ServiceType.Price} ден.</td></tr>");
                bodyBuilder.AppendLine($"<tr><td>⏳ Времетраење:</td><td>{appointmentDto.AppointmentData.ServiceType.Duration} мин.</td></tr>");
                bodyBuilder.AppendLine("</table>");

                bodyBuilder.AppendLine("<p>Ве молиме да пристигнете навреме. Доколку сакате да ја откажете или промените вашата резервација, контактирајте не најмалку 24 часа однапред.</p>");
                bodyBuilder.AppendLine("<p>Со почит,</p>");
                bodyBuilder.AppendLine("<p><strong>[Studio Infinito]</strong></p>");
                bodyBuilder.AppendLine("<p>📞 [078 300 047] | 📍 [Hristo Smirnenski 37, Skopje, Republic of Macedonia, 1000]</p>");
                bodyBuilder.AppendLine("</div>");
                bodyBuilder.AppendLine("</body></html>");

                var plainTextBody = "Вашата резервација е успешно направена!";

                var mailMessage = new MailMessage
                {
                    From = new MailAddress(configuration["MailSettings:Mail"], "Studio Infinito"),
                    Subject = "Успешна резервација на термин",
                    Body = bodyBuilder.ToString(),
                    IsBodyHtml = true
                };

                mailMessage.To.Add(appointmentDto.UserEmail);
                mailMessage.ReplyToList.Add(new MailAddress(configuration["MailSettings:Mail"]));
                mailMessage.AlternateViews.Add(AlternateView.CreateAlternateViewFromString(plainTextBody, Encoding.UTF8, "text/plain"));

                using var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential(
                        configuration["MailSettings:Mail"],
                        configuration["MailSettings:Password"]),
                    EnableSsl = true,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    UseDefaultCredentials = false,
                };

                await smtpClient.SendMailAsync(mailMessage);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[Email Error] {ex.Message}");
            }
        }

        private void SendViberMessage(AppointmentDto appointmentDetails)
        {
            Console.WriteLine($"Sending Viber message to {appointmentDetails.UserPhone} about the appointment: {appointmentDetails}");
        }
    }
}
