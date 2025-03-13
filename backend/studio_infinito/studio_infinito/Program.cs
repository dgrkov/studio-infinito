using studio_infinito.Data;
using studio_infinito.Services;
using studio_infinito.Services.Implementation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using studio_infinito.Events;
using System.Diagnostics;

var builder = WebApplication.CreateBuilder(args);

IConfiguration configuration = (new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json").Build());
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddScoped<DbContext>();

var jwtIssuer = builder.Configuration.GetSection("Jwt:Issuer").Get<string>();
var jwtAudience = builder.Configuration.GetSection("Jwt:Audience").Get<string>();
var key = Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]);
var securityKey = new SymmetricSecurityKey(key);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"])),
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["JWT:Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero // Optional: Avoids delay in token expiration
        };
        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                Console.WriteLine($"🟢 Received Token: {context.Token ?? "No Token"}");
                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"❌ JWT Authentication Failed: {context.Exception?.Message}");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();
/* 
    * Example for adding dependency injections
    * 
    * builder.Services.AddScoped<ILoginService, LoginService>();
    * builder.Services.AddScoped<IDataService, DataService>();
*/

builder.Services.AddScoped<ICalendarService, CalendarService>();
builder.Services.AddScoped<IAppointmentsService, AppointmentsService>();
builder.Services.AddScoped<IAuthService, AuthService>();

builder.Services.AddSingleton<AppointmentCreatedEvent>();
builder.Services.AddSingleton<AppointmentService>();

builder.Services.AddHttpContextAccessor();
builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromDays(30);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddHttpContextAccessor();

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

// Configure the HTTP request pipeline.
app.UseSwagger();
app.UseSwaggerUI();

var appointmentService = app.Services.GetRequiredService<AppointmentService>();
var appointmentCreatedEvent = app.Services.GetRequiredService<AppointmentCreatedEvent>();

app.UseHttpsRedirection();

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.UseSession();

app.MapControllers();

app.Run();