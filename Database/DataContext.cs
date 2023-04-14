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
        modelBuilder.Entity<Question>()
            .HasOne(q => q.CreatedBy)
            .WithMany()
            .HasForeignKey(q => q.CreatedById);
    }

    public DbSet<Models.WeatherForecast> WeatherForecasts { get; set; } = default!;
    public DbSet<Question> Questions { get; set; } = default!;
    public DbSet<Comment> Comments { get; set; } = default!;
    public DbSet<User> Users => Set<User>();
}
