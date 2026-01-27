using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddStudentClassEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "StudentClassId",
                table: "Students",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "StudentClasses",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    SchoolId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentClasses", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StudentClasses_Schools_SchoolId",
                        column: x => x.SchoolId,
                        principalTable: "Schools",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Students_StudentClassId",
                table: "Students",
                column: "StudentClassId");

            migrationBuilder.CreateIndex(
                name: "IX_StudentClasses_SchoolId",
                table: "StudentClasses",
                column: "SchoolId");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_StudentClasses_StudentClassId",
                table: "Students",
                column: "StudentClassId",
                principalTable: "StudentClasses",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_StudentClasses_StudentClassId",
                table: "Students");

            migrationBuilder.DropTable(
                name: "StudentClasses");

            migrationBuilder.DropIndex(
                name: "IX_Students_StudentClassId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "StudentClassId",
                table: "Students");
        }
    }
}
