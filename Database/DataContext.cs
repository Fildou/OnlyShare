using Microsoft.EntityFrameworkCore;
using OnlyShare.Database.Models;

namespace OnlyShare.Database;
public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Models.WeatherForecast>().HasData(new Models.WeatherForecast
        {
            Id = Guid.NewGuid(),
            Date = DateTime.Now.AddYears(-2),
            Summary = "Weather 1",
            TemperatureC = 30,
        });
        modelBuilder.Entity<Models.WeatherForecast>().HasData(new Models.WeatherForecast
        {
            Id = Guid.NewGuid(),
            Date = DateTime.Now.AddYears(-1),
            Summary = "Weather 2",
            TemperatureC = 35,
        });
        modelBuilder.Entity<Models.WeatherForecast>().HasData(new Models.WeatherForecast
        {
            Id = Guid.NewGuid(),
            Date = DateTime.Now,
            Summary = "Weather 3",
            TemperatureC = 40,
        });
    }

    public DbSet<Models.WeatherForecast> WeatherForecasts { get; set; } = default!;
    public DbSet<User> Users => Set<User>();
}
