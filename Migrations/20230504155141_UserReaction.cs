using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnlyShare.Migrations
{
    /// <inheritdoc />
    public partial class UserReaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePictureUrl",
                table: "Users");

            migrationBuilder.DropTable(
                name: "UserReactions");

            migrationBuilder.AddColumn<int>(
                name: "Dislikes",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "Likes",
                table: "Users",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "UserReactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    UserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReactedUserId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    ReactionType = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserReactions", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "UserReactions");

            migrationBuilder.DropColumn(
                name: "Dislikes",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Likes",
                table: "Users");

            migrationBuilder.AddColumn<string>(
                name: "ProfilePictureUrl",
                table: "Users",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
