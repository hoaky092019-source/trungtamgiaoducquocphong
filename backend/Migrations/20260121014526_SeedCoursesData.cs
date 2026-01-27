using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class SeedCoursesData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("INSERT INTO Courses (Name, StartDate, EndDate, IsActive) VALUES (N'Khóa 124 - GDQP', '2025-09-01', '2026-06-30', 1)");
            migrationBuilder.Sql("INSERT INTO Courses (Name, StartDate, EndDate, IsActive) VALUES (N'Khóa 125 - GDQP', '2026-09-01', '2027-06-30', 1)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
