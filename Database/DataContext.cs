﻿using Microsoft.EntityFrameworkCore;
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

        modelBuilder.Entity<CommentReaction>()
            .HasOne(cr => cr.User)
            .WithMany()
            .HasForeignKey(cr => cr.UserId);

        modelBuilder.Entity<CommentReaction>()
            .HasOne(cr => cr.Comment)
            .WithMany()
            .HasForeignKey(cr => cr.CommentId);
    }


    public DbSet<Models.WeatherForecast> WeatherForecasts { get; set; } = default!;
    public DbSet<Question> Questions { get; set; } = default!;
    public DbSet<Comment> Comments { get; set; } = default!;
    public DbSet<User> Users => Set<User>();
    public DbSet<UserReaction> UserReactions { get; set; } = default!;

    public DbSet <CommentReaction> CommentReactions { get; set; } = default!;
}
