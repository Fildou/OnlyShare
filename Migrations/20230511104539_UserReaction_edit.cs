using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnlyShare.Migrations
{
    /// <inheritdoc />
    public partial class UserReaction_edit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ReactedUserId",
                table: "CommentReactions");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "ReactedUserId",
                table: "CommentReactions",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }
    }
}
