using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddLessonsTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Lessons",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SubjectId = table.Column<int>(type: "int", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(255)", maxLength: 255, nullable: false),
                    Order = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Lessons", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Lessons_Subjects_SubjectId",
                        column: x => x.SubjectId,
                        principalTable: "Subjects",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Lessons",
                columns: new[] { "Id", "Name", "Order", "SubjectId" },
                values: new object[,]
                {
                    { 1, "Bài 1: Đối tượng, phương pháp nghiên cứu môn học GDQP&AN", 1, 1 },
                    { 2, "Bài 2: Quan điểm của chủ nghĩa Mác - Lênin, tư tưởng HCM về chiến tranh, quân đội và bảo vệ tổ quốc", 2, 1 },
                    { 3, "Bài 3: Xây dựng nền quốc phòng toàn dân, an ninh nhân dân", 3, 1 },
                    { 4, "Bài 4: Chiến tranh nhân dân bảo vệ Tổ quốc Việt Nam XHCN", 4, 1 },
                    { 5, "Bài 5: Xây dựng lực lượng vũ trang nhân dân Việt Nam", 5, 1 },
                    { 6, "Bài 6: Kết hợp phát triển kinh tế - xã hội với tăng cường củng cố QP&AN", 6, 1 },
                    { 7, "Bài 7: Nghệ thuật quân sự Việt Nam", 7, 1 },
                    { 8, "Bài 8: Xây dựng và bảo vệ chủ quyền biên giới quốc gia", 8, 1 },
                    { 9, "Bài 9: Xây dựng và bảo vệ chủ quyền biển, đảo Việt Nam", 9, 1 },
                    { 10, "Bài 10: Bảo vệ an ninh quốc gia và bảo đảm trật tự, an toàn xã hội", 10, 1 },
                    { 11, "Bài 11: Phòng chống chiến lược 'diễn biến hòa bình', bạo loạn lật đổ của các thế lực thù địch", 11, 1 },
                    { 12, "Bài 1: Phòng chống địch tiến công hỏa lực bằng vũ khí công nghệ cao", 1, 2 },
                    { 13, "Bài 2: Phòng chống vi phạm pháp luật về bảo vệ môi trường", 2, 2 },
                    { 14, "Bài 3: Phòng chống vi phạm pháp luật về bảo đảm trật tự an toàn giao thông", 3, 2 },
                    { 15, "Bài 4: Phòng chống một số loại tội phạm xâm hại danh dự, nhân phẩm", 4, 2 },
                    { 16, "Bài 5: An toàn thông tin và phòng chống vi phạm pháp luật trên không gian mạng", 5, 2 },
                    { 17, "Bài 6: Phòng chống tệ nạn xã hội", 6, 2 },
                    { 18, "Bài 7: Xây dựng phong trào toàn dân bảo vệ an ninh Tổ quốc", 7, 2 },
                    { 19, "Bài 1: Đội ngũ đơn vị", 1, 3 },
                    { 20, "Bài 2: Đội ngũ từng người không có súng", 2, 3 },
                    { 21, "Bài 3: Đội ngũ từng người có súng", 3, 3 },
                    { 22, "Bài 4: Hiểu biết chung về bản đồ địa hình quân sự", 4, 3 },
                    { 23, "Bài 5: Số đo xa, thước đo độ, ống nhòm nhìn đêm, định hướng bàn đồ", 5, 3 },
                    { 24, "Bài 6: Phòng hóa", 6, 3 },
                    { 25, "Bài 7: Y tế", 7, 3 },
                    { 26, "Bài 8: Ba môn quân sự phối hợp", 8, 3 },
                    { 27, "Bài 1: Kỹ thuật bắn súng tiểu liên AK", 1, 4 },
                    { 28, "Bài 2: Tính năng, cấu tạo, sử dụng một số loại lựu đạn", 2, 4 },
                    { 29, "Bài 3: Từng người trong chiến đấu tiến công", 3, 4 },
                    { 30, "Bài 4: Từng người trong chiến đấu phòng ngự", 4, 4 },
                    { 31, "Bài 5: Từng người làm nhiệm vụ canh gác", 5, 4 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Lessons_SubjectId",
                table: "Lessons",
                column: "SubjectId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Lessons");
        }
    }
}
