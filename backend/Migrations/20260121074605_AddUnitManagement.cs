using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUnitManagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BattalionId",
                table: "Students",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "BuildingId",
                table: "Students",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "CompanyId",
                table: "Students",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "OrganizationalUnits",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Code = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Type = table.Column<int>(type: "int", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    ParentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrganizationalUnits", x => x.Id);
                    table.ForeignKey(
                        name: "FK_OrganizationalUnits_OrganizationalUnits_ParentId",
                        column: x => x.ParentId,
                        principalTable: "OrganizationalUnits",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "Buildings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    OrganizationalUnitId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Buildings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Buildings_OrganizationalUnits_OrganizationalUnitId",
                        column: x => x.OrganizationalUnitId,
                        principalTable: "OrganizationalUnits",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Students_BattalionId",
                table: "Students",
                column: "BattalionId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_BuildingId",
                table: "Students",
                column: "BuildingId");

            migrationBuilder.CreateIndex(
                name: "IX_Students_CompanyId",
                table: "Students",
                column: "CompanyId");

            migrationBuilder.CreateIndex(
                name: "IX_Buildings_OrganizationalUnitId",
                table: "Buildings",
                column: "OrganizationalUnitId");

            migrationBuilder.CreateIndex(
                name: "IX_OrganizationalUnits_ParentId",
                table: "OrganizationalUnits",
                column: "ParentId");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_Buildings_BuildingId",
                table: "Students",
                column: "BuildingId",
                principalTable: "Buildings",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_OrganizationalUnits_BattalionId",
                table: "Students",
                column: "BattalionId",
                principalTable: "OrganizationalUnits",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Students_OrganizationalUnits_CompanyId",
                table: "Students",
                column: "CompanyId",
                principalTable: "OrganizationalUnits",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Students_Buildings_BuildingId",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_OrganizationalUnits_BattalionId",
                table: "Students");

            migrationBuilder.DropForeignKey(
                name: "FK_Students_OrganizationalUnits_CompanyId",
                table: "Students");

            migrationBuilder.DropTable(
                name: "Buildings");

            migrationBuilder.DropTable(
                name: "OrganizationalUnits");

            migrationBuilder.DropIndex(
                name: "IX_Students_BattalionId",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_BuildingId",
                table: "Students");

            migrationBuilder.DropIndex(
                name: "IX_Students_CompanyId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "BattalionId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "BuildingId",
                table: "Students");

            migrationBuilder.DropColumn(
                name: "CompanyId",
                table: "Students");
        }
    }
}
