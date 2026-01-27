using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class RefactorGDQPSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Code",
                table: "Subjects",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "TrainingSessions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CourseId = table.Column<int>(type: "int", nullable: false),
                    SubjectId = table.Column<int>(type: "int", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Shift = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Content = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Location = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Lecturer = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TrainingSessions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TrainingSessions_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TrainingSessions_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            // Upsert HP1
            migrationBuilder.Sql("IF EXISTS (SELECT 1 FROM Subjects WHERE Id = 1) UPDATE Subjects SET Code = 'HP1', Name = N'Đường lối quốc phòng và an ninh của Đảng Cộng sản Việt Nam', Credits = 3 WHERE Id = 1 ELSE INSERT INTO Subjects (Id, Code, Name, Credits) VALUES (1, 'HP1', N'Đường lối quốc phòng và an ninh của Đảng Cộng sản Việt Nam', 3)");
            
            // Upsert HP2
            migrationBuilder.Sql("IF EXISTS (SELECT 1 FROM Subjects WHERE Id = 2) UPDATE Subjects SET Code = 'HP2', Name = N'Công tác quốc phòng và an ninh', Credits = 2 WHERE Id = 2 ELSE INSERT INTO Subjects (Id, Code, Name, Credits) VALUES (2, 'HP2', N'Công tác quốc phòng và an ninh', 2)");

            // Upsert HP3
            migrationBuilder.Sql("IF EXISTS (SELECT 1 FROM Subjects WHERE Id = 3) UPDATE Subjects SET Code = 'HP3', Name = N'Quân sự chung', Credits = 2 WHERE Id = 3 ELSE INSERT INTO Subjects (Id, Code, Name, Credits) VALUES (3, 'HP3', N'Quân sự chung', 2)");

            // Upsert HP4
            migrationBuilder.Sql("IF EXISTS (SELECT 1 FROM Subjects WHERE Id = 4) UPDATE Subjects SET Code = 'HP4', Name = N'Kỹ thuật chiến đấu bộ binh và chiến thuật', Credits = 4 WHERE Id = 4 ELSE INSERT INTO Subjects (Id, Code, Name, Credits) VALUES (4, 'HP4', N'Kỹ thuật chiến đấu bộ binh và chiến thuật', 4)");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingSessions_CourseId",
                table: "TrainingSessions",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_TrainingSessions_SubjectId",
                table: "TrainingSessions",
                column: "SubjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TrainingSessions");

            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Subjects",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DropColumn(
                name: "Code",
                table: "Subjects");
        }
    }
}
