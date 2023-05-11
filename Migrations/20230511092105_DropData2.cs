using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace OnlyShare.Migrations
{
    /// <inheritdoc />
    public partial class DropData2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM Comments ");
            migrationBuilder.Sql("DELETE FROM Users ");
            migrationBuilder.Sql("DELETE FROM Questions ");
            migrationBuilder.Sql("DELETE FROM UserReactions ");
            migrationBuilder.Sql("DELETE FROM CommentReactions ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
