using studio_infinito.Data;
using studio_infinito.Services;
using studio_infinito.Services.Implementation;
using System.Diagnostics;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using studio_infinito.Events;
using studio_infinito.DTOs;

var builder = WebApplication.CreateBuilder(args);

IConfiguration configuration = (new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build());
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var jwtIssuer = builder.Configuration.GetSection("Jwt:Issuer").Get<string>();
var jwtAudience = builder.Configuration.GetSection("Jwt:Audience").Get<string>();
var jwtKey = builder.Configuration.GetSection("Jwt:Key").Get<string>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
 .AddJwtBearer(options =>
 {
     options.TokenValidationParameters = new TokenValidationParameters
     {
         ValidateIssuer = true,
         ValidateAudience = true,
         ValidateLifetime = true,
         ValidateIssuerSigningKey = true,
         ValidIssuer = jwtIssuer,
         ValidAudience = jwtAudience,
         IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
     };

     options.Events = new JwtBearerEvents
     {
         OnTokenValidated = context => {
             Debug.WriteLine($"Token validated successfully for {context.Principal.Identity.Name}");
             return Task.CompletedTask;
         },
         OnAuthenticationFailed = context => {
             Debug.WriteLine($"Authentication failed: {context.Exception}");
             return Task.CompletedTask;
         }
     };

 });

builder.Services.AddScoped<studio_infinito.Data.DbContext>();

builder.Services.AddScoped<ICalendarService, CalendarService>();
builder.Services.AddScoped<IAppointmentsService, AppointmentsService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddSingleton<AppointmentService>();

var allowedOrigins = builder.Configuration.GetSection("AllowedHosts").Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins(allowedOrigins)
            .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
        });
});

var app = builder.Build();

var appointmentService = app.Services.GetRequiredService<AppointmentService>();
var appointmentCreatedEvent = new AppointmentCreatedEvent(appointmentService);

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

var firebaseService = new FirebaseService();

app.MapPost("/send-notification", async (HttpContext context) =>
{
    try
    {
        var requestData = await context.Request.ReadFromJsonAsync<NotificationRequest>();
        await firebaseService.SendNotification(requestData.DeviceToken, requestData.Title, requestData.Body);
        return Results.Ok(new { message = "Notification Sent!" });
    } catch (Exception ex)
    {
        return Results.BadRequest(ex.Message);
    }
});


app.UseCors();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();