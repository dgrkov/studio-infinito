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
            var path = Path.Combine(Directory.GetCurrentDirectory(), "studio-infinito-firebase-adminsdk-fbsvc-2634e5c0c5.json");
            firebaseApp = FirebaseApp.Create(new AppOptions()
            {
                Credential = GoogleCredential.FromFile(path)
            });
        }
    }

    public async Task SendNotification(string deviceToken, string title, string body, string iconUrl)
    {
        var message = new Message()
        {
            Token = deviceToken,
            Notification = new Notification()
            {
                Title = title,
                Body = body
            },
            Data = new Dictionary<string, string>()
            {
                { "icon", iconUrl }
            },
            Android = new AndroidConfig()
            {
                Notification = new AndroidNotification()
                {
                    Icon = iconUrl,
                    ImageUrl = iconUrl
                }
            },
            Apns = new ApnsConfig()
            {
                Aps = new Aps()
                {
                    CustomData = new Dictionary<string, object>()
                {
                    { "icon", iconUrl }
                }
                }
            }
        };

        try
        {
            string response = await FirebaseMessaging.DefaultInstance.SendAsync(message);
            Console.WriteLine($"Successfully sent message: {response}");
        }
        catch (FirebaseMessagingException fcmEx)
        {
            Console.WriteLine($"FCM Error: {fcmEx.Message}");
            Console.WriteLine($"FCM Details: {fcmEx.InnerException}");
        }
    }



}
