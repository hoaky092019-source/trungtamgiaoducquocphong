using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddGradeSystem : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Classification",
                table: "StudentGrades");

            migrationBuilder.DropColumn(
                name: "ModuleName",
                table: "StudentGrades");

            migrationBuilder.DropColumn(
                name: "Score",
                table: "StudentGrades");

            migrationBuilder.AddColumn<double>(
                name: "FinalScore",
                table: "StudentGrades",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Score1",
                table: "StudentGrades",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<double>(
                name: "Score2",
                table: "StudentGrades",
                type: "float",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SubjectId",
                table: "StudentGrades",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "Schedules",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CourseId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    MorningContent = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    AfternoonContent = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    EveningContent = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: true),
                    Location = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schedules", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Schedules_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Subjects",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Credits = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Subjects", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StudentGrades_SubjectId",
                table: "StudentGrades",
                column: "SubjectId");

            migrationBuilder.CreateIndex(
                name: "IX_Schedules_CourseId",
                table: "Schedules",
                column: "CourseId");

            migrationBuilder.AddForeignKey(
                name: "FK_StudentGrades_Subjects_SubjectId",
                table: "StudentGrades",
                column: "SubjectId",
                principalTable: "Subjects",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_StudentGrades_Subjects_SubjectId",
                table: "StudentGrades");

            migrationBuilder.DropTable(
                name: "Schedules");

            migrationBuilder.DropTable(
                name: "Subjects");

            migrationBuilder.DropIndex(
                name: "IX_StudentGrades_SubjectId",
                table: "StudentGrades");

            migrationBuilder.DropColumn(
                name: "FinalScore",
                table: "StudentGrades");

            migrationBuilder.DropColumn(
                name: "Score1",
                table: "StudentGrades");

            migrationBuilder.DropColumn(
                name: "Score2",
                table: "StudentGrades");

            migrationBuilder.DropColumn(
                name: "SubjectId",
                table: "StudentGrades");

            migrationBuilder.AddColumn<string>(
                name: "Classification",
                table: "StudentGrades",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ModuleName",
                table: "StudentGrades",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<double>(
                name: "Score",
                table: "StudentGrades",
                type: "float",
                nullable: false,
                defaultValue: 0.0);
        }
    }
}
