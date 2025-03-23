using FirebaseAdmin;
using FirebaseAdmin.Messaging;
using Google.Apis.Auth.OAuth2;
using System;
using System.Threading.Tasks;

public class FirebaseService
{
    private static FirebaseApp firebaseApp;

    public FirebaseService()
    {
        if (firebaseApp == null)
        {
            firebaseApp = FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile("studio-infinito-firebase-adminsdk-fbsvc-2634e5c0c5.json")
            });
        }
    }

    public async Task SendNotification(string deviceToken, string title, string body)
    {
        var message = new Message()
        {
            Token = deviceToken,
            Notification = new Notification()
            {
                Title = title,
                Body = body
            }
        };

        string response = await FirebaseMessaging.DefaultInstance.SendAsync(message);
        Console.WriteLine("Successfully sent message: " + response);
    }
}
