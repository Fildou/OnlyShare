using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace OnlyShare.Migrations
{
    /// <inheritdoc />
    public partial class RegistrationMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Username = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PasswordHash = table.Column<byte[]>(type: "varbinary(max)", nullable: false),
                    PasswordSalt = table.Column<byte[]>(type: "varbinary(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "WeatherForecasts",
                columns: new[] { "Id", "Date", "Summary", "TemperatureC" },
                values: new object[,]
                {
                    { new Guid("00a7f9b9-e6d1-44ca-867d-0405126f566b"), new DateTime(2021, 3, 9, 21, 39, 58, 315, DateTimeKind.Local).AddTicks(4050), "Weather 1", 30 },
                    { new Guid("43aebcb3-bb66-4452-9129-e612fa25ff9c"), new DateTime(2023, 3, 9, 21, 39, 58, 315, DateTimeKind.Local).AddTicks(4140), "Weather 3", 40 },
                    { new Guid("75b9b3ff-61c1-4bdb-99dc-ab96d838f149"), new DateTime(2022, 3, 9, 21, 39, 58, 315, DateTimeKind.Local).AddTicks(4127), "Weather 2", 35 }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DeleteData(
                table: "WeatherForecasts",
                keyColumn: "Id",
                keyValue: new Guid("00a7f9b9-e6d1-44ca-867d-0405126f566b"));

            migrationBuilder.DeleteData(
                table: "WeatherForecasts",
                keyColumn: "Id",
                keyValue: new Guid("43aebcb3-bb66-4452-9129-e612fa25ff9c"));

            migrationBuilder.DeleteData(
                table: "WeatherForecasts",
                keyColumn: "Id",
                keyValue: new Guid("75b9b3ff-61c1-4bdb-99dc-ab96d838f149"));
        }
    }
}
