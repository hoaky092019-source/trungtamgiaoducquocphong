using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

public partial class TrungtamgiaoducquocphongContext : DbContext
{
    public TrungtamgiaoducquocphongContext()
    {
    }

    public TrungtamgiaoducquocphongContext(DbContextOptions<TrungtamgiaoducquocphongContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Document> Documents { get; set; }

    public virtual DbSet<Faculty> Faculties { get; set; }

    public virtual DbSet<FileConversion> FileConversions { get; set; }

    public virtual DbSet<FileNode> FileNodes { get; set; }

    public virtual DbSet<Log> Logs { get; set; }

    public virtual DbSet<Permission> Permissions { get; set; }

    public virtual DbSet<Post> Posts { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<SiteStatistic> SiteStatistics { get; set; }

    public virtual DbSet<Notification> Notifications { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<School> Schools { get; set; }
    public virtual DbSet<Course> Courses { get; set; }
    public virtual DbSet<StudentClass> StudentClasses { get; set; }
    public virtual DbSet<OrganizationalUnit> OrganizationalUnits { get; set; }
    public virtual DbSet<Building> Buildings { get; set; }
    public virtual DbSet<Student> Students { get; set; }
    public virtual DbSet<StudentGrade> StudentGrades { get; set; }
    public virtual DbSet<Schedule> Schedules { get; set; }
    public virtual DbSet<Subject> Subjects { get; set; }

   
    public virtual DbSet<TrainingSession> TrainingSessions { get; set; }
    public virtual DbSet<Lesson> Lessons { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Seed Subjects (HP1-HP4)
        modelBuilder.Entity<Subject>().HasData(
            new Subject { Id = 1, Code = "HP1", Name = "Đường lối quốc phòng và an ninh của Đảng Cộng sản Việt Nam", Credits = 3 },
            new Subject { Id = 2, Code = "HP2", Name = "Công tác quốc phòng và an ninh", Credits = 2 },
            new Subject { Id = 3, Code = "HP3", Name = "Quân sự chung", Credits = 2 },
            new Subject { Id = 4, Code = "HP4", Name = "Kỹ thuật chiến đấu bộ binh và chiến thuật", Credits = 4 }
        );

        // Seed Lessons (According to Circular 05/2020/TT-BGDĐT)
        modelBuilder.Entity<Lesson>().HasData(
            // HP1 (11 Lessons)
            new Lesson { Id = 1, SubjectId = 1, Order = 1, Name = "Bài 1: Đối tượng, phương pháp nghiên cứu môn học GDQP&AN" },
            new Lesson { Id = 2, SubjectId = 1, Order = 2, Name = "Bài 2: Quan điểm của chủ nghĩa Mác - Lênin, tư tưởng HCM về chiến tranh, quân đội và bảo vệ tổ quốc" },
            new Lesson { Id = 3, SubjectId = 1, Order = 3, Name = "Bài 3: Xây dựng nền quốc phòng toàn dân, an ninh nhân dân" },
            new Lesson { Id = 4, SubjectId = 1, Order = 4, Name = "Bài 4: Chiến tranh nhân dân bảo vệ Tổ quốc Việt Nam XHCN" },
            new Lesson { Id = 5, SubjectId = 1, Order = 5, Name = "Bài 5: Xây dựng lực lượng vũ trang nhân dân Việt Nam" },
            new Lesson { Id = 6, SubjectId = 1, Order = 6, Name = "Bài 6: Kết hợp phát triển kinh tế - xã hội với tăng cường củng cố QP&AN" },
            new Lesson { Id = 7, SubjectId = 1, Order = 7, Name = "Bài 7: Nghệ thuật quân sự Việt Nam" },
            new Lesson { Id = 8, SubjectId = 1, Order = 8, Name = "Bài 8: Xây dựng và bảo vệ chủ quyền biên giới quốc gia" },
            new Lesson { Id = 9, SubjectId = 1, Order = 9, Name = "Bài 9: Xây dựng và bảo vệ chủ quyền biển, đảo Việt Nam" },
            new Lesson { Id = 10, SubjectId = 1, Order = 10, Name = "Bài 10: Bảo vệ an ninh quốc gia và bảo đảm trật tự, an toàn xã hội" },
            new Lesson { Id = 11, SubjectId = 1, Order = 11, Name = "Bài 11: Phòng chống chiến lược 'diễn biến hòa bình', bạo loạn lật đổ của các thế lực thù địch" },

            // HP2 (7 Lessons)
            new Lesson { Id = 12, SubjectId = 2, Order = 1, Name = "Bài 1: Phòng chống địch tiến công hỏa lực bằng vũ khí công nghệ cao" },
            new Lesson { Id = 13, SubjectId = 2, Order = 2, Name = "Bài 2: Phòng chống vi phạm pháp luật về bảo vệ môi trường" },
            new Lesson { Id = 14, SubjectId = 2, Order = 3, Name = "Bài 3: Phòng chống vi phạm pháp luật về bảo đảm trật tự an toàn giao thông" },
            new Lesson { Id = 15, SubjectId = 2, Order = 4, Name = "Bài 4: Phòng chống một số loại tội phạm xâm hại danh dự, nhân phẩm" },
            new Lesson { Id = 16, SubjectId = 2, Order = 5, Name = "Bài 5: An toàn thông tin và phòng chống vi phạm pháp luật trên không gian mạng" },
            new Lesson { Id = 17, SubjectId = 2, Order = 6, Name = "Bài 6: Phòng chống tệ nạn xã hội" },
            new Lesson { Id = 18, SubjectId = 2, Order = 7, Name = "Bài 7: Xây dựng phong trào toàn dân bảo vệ an ninh Tổ quốc" },

            // HP3 (8 Lessons)
            new Lesson { Id = 19, SubjectId = 3, Order = 1, Name = "Bài 1: Đội ngũ đơn vị" },
            new Lesson { Id = 20, SubjectId = 3, Order = 2, Name = "Bài 2: Đội ngũ từng người không có súng" },
            new Lesson { Id = 21, SubjectId = 3, Order = 3, Name = "Bài 3: Đội ngũ từng người có súng" },
            new Lesson { Id = 22, SubjectId = 3, Order = 4, Name = "Bài 4: Hiểu biết chung về bản đồ địa hình quân sự" },
            new Lesson { Id = 23, SubjectId = 3, Order = 5, Name = "Bài 5: Số đo xa, thước đo độ, ống nhòm nhìn đêm, định hướng bàn đồ" },
            new Lesson { Id = 24, SubjectId = 3, Order = 6, Name = "Bài 6: Phòng hóa" },
            new Lesson { Id = 25, SubjectId = 3, Order = 7, Name = "Bài 7: Y tế" },
            new Lesson { Id = 26, SubjectId = 3, Order = 8, Name = "Bài 8: Ba môn quân sự phối hợp" },

            // HP4 (5 Lessons)
            new Lesson { Id = 27, SubjectId = 4, Order = 1, Name = "Bài 1: Kỹ thuật bắn súng tiểu liên AK" },
            new Lesson { Id = 28, SubjectId = 4, Order = 2, Name = "Bài 2: Tính năng, cấu tạo, sử dụng một số loại lựu đạn" },
            new Lesson { Id = 29, SubjectId = 4, Order = 3, Name = "Bài 3: Từng người trong chiến đấu tiến công" },
            new Lesson { Id = 30, SubjectId = 4, Order = 4, Name = "Bài 4: Từng người trong chiến đấu phòng ngự" },
            new Lesson { Id = 31, SubjectId = 4, Order = 5, Name = "Bài 5: Từng người làm nhiệm vụ canh gác" }
        );

        modelBuilder.Entity<Notification>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Type).HasMaxLength(50).HasDefaultValue("info");
            entity.Property(e => e.IsRead).HasDefaultValue(false);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETDATE()");

            entity.HasOne(d => d.User)
                .WithMany()
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PK__Categori__19093A2BE6F789CB");

            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.CategoryName).HasMaxLength(255);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.ParentCategoryId).HasColumnName("ParentCategoryID");
            entity.Property(e => e.Slug).HasMaxLength(255);

            entity.HasOne(d => d.ParentCategory).WithMany(p => p.InverseParentCategory)
                .HasForeignKey(d => d.ParentCategoryId)
                .HasConstraintName("FK_Categories_Parent");
        });

        modelBuilder.Entity<Document>(entity =>
        {
            entity.HasKey(e => e.DocumentId).HasName("PK__Document__1ABEEF6FE7BC6517");

            entity.Property(e => e.DocumentId).HasColumnName("DocumentID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FacultyId).HasColumnName("FacultyID");
            entity.Property(e => e.FilePath).HasMaxLength(255);
            entity.Property(e => e.TargetAudience).HasMaxLength(20);
            entity.Property(e => e.Title).HasMaxLength(200);

            entity.HasOne(d => d.Faculty).WithMany(p => p.Documents)
                .HasForeignKey(d => d.FacultyId)
                .HasConstraintName("FK_Documents_Faculty");

            entity.HasOne(d => d.UploadedByNavigation).WithMany(p => p.Documents)
                .HasForeignKey(d => d.UploadedBy)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Documents_User");
        });

        modelBuilder.Entity<Faculty>(entity =>
        {
            entity.HasKey(e => e.FacultyId).HasName("PK__Facultie__306F636E548E8856");

            entity.Property(e => e.FacultyId).HasColumnName("FacultyID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.FacultyName).HasMaxLength(100);
        });

        modelBuilder.Entity<FileConversion>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FileConv__3214EC07AB0B18B7");

            entity.Property(e => e.ConvertType).HasMaxLength(50);
            entity.Property(e => e.ConvertedFileName).HasMaxLength(255);
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FileSizeKb)
                .HasColumnType("decimal(10, 2)")
                .HasColumnName("FileSizeKB");
            entity.Property(e => e.OriginalFileName).HasMaxLength(255);
            entity.Property(e => e.OutputPath).HasMaxLength(500);
            entity.Property(e => e.UploadPath).HasMaxLength(500);
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.FileConversions)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("FK_FileConversions_Users");
        });

        modelBuilder.Entity<FileNode>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FileNode__3214EC073CB28DBD");

            entity.Property(e => e.LastModified)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Name).HasMaxLength(255);
            entity.Property(e => e.Path).HasMaxLength(1000);

            entity.HasOne(d => d.Parent).WithMany(p => p.InverseParent)
                .HasForeignKey(d => d.ParentId)
                .HasConstraintName("FK_FileNodes_Parent");

            entity.HasOne(d => d.UploadedByUser).WithMany(p => p.FileNodes)
                .HasForeignKey(d => d.UploadedByUserId)
                .HasConstraintName("FK_FileNodes_User");
        });

        modelBuilder.Entity<Log>(entity =>
        {
            entity.HasKey(e => e.LogId).HasName("PK__Logs__5E5499A8A322879A");

            entity.Property(e => e.LogId).HasColumnName("LogID");
            entity.Property(e => e.Action).HasMaxLength(100);
            entity.Property(e => e.Ipaddress)
                .HasMaxLength(50)
                .HasColumnName("IPAddress");
            entity.Property(e => e.TargetId).HasColumnName("TargetID");
            entity.Property(e => e.Timestamp)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.UserId).HasColumnName("UserID");

            entity.HasOne(d => d.User).WithMany(p => p.Logs)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Logs_User");
        });

        modelBuilder.Entity<Permission>(entity =>
        {
            entity.HasKey(e => e.PermissionId).HasName("PK__Permissi__EFA6FB0F57D29D99");

            entity.Property(e => e.PermissionId).HasColumnName("PermissionID");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.PermissionName).HasMaxLength(100);
        });

        modelBuilder.Entity<Post>(entity =>
        {
            entity.HasKey(e => e.PostId).HasName("PK__Posts__AA12603800BDF556");

            entity.Property(e => e.PostId).HasColumnName("PostID");
            entity.Property(e => e.AuthorId).HasColumnName("AuthorID");
            entity.Property(e => e.CategoryId).HasColumnName("CategoryID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.FacultyId).HasColumnName("FacultyID");
            entity.Property(e => e.PublishedAt).HasColumnType("datetime");
            entity.Property(e => e.Slug).HasMaxLength(255);
            entity.Property(e => e.Status)
                .HasMaxLength(20)
                .HasDefaultValue("Published");
            entity.Property(e => e.Thumbnail).HasMaxLength(500);
            entity.Property(e => e.Title).HasMaxLength(200);
            entity.Property(e => e.UpdatedAt).HasColumnType("datetime");
            entity.Property(e => e.ApproverId).HasColumnName("ApproverID");
            entity.Property(e => e.ApprovalComment).HasMaxLength(500);

            entity.HasOne(d => d.Author).WithMany(p => p.Posts)
                .HasForeignKey(d => d.AuthorId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Posts_Author");

            entity.HasOne(d => d.Approver).WithMany()
                .HasForeignKey(d => d.ApproverId)
                .HasConstraintName("FK_Posts_Approver");

            entity.HasOne(d => d.Category).WithMany(p => p.Posts)
                .HasForeignKey(d => d.CategoryId)
                .HasConstraintName("FK_Posts_Categories");

            entity.HasOne(d => d.Faculty).WithMany(p => p.Posts)
                .HasForeignKey(d => d.FacultyId)
                .HasConstraintName("FK_Posts_Faculty");
        });

        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(e => e.RoleId).HasName("PK__Roles__8AFACE3A92475AE2");

            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.Description).HasMaxLength(255);
            entity.Property(e => e.RoleName).HasMaxLength(50);

            entity.HasMany(d => d.Permissions).WithMany(p => p.Roles)
                .UsingEntity<Dictionary<string, object>>(
                    "RolePermission",
                    r => r.HasOne<Permission>().WithMany()
                        .HasForeignKey("PermissionId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_RolePermissions_Permissions"),
                    l => l.HasOne<Role>().WithMany()
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_RolePermissions_Roles"),
                    j =>
                    {
                        j.HasKey("RoleId", "PermissionId").HasName("PK__RolePerm__6400A18ADD1B0104");
                        j.ToTable("RolePermissions");
                        j.IndexerProperty<int>("RoleId").HasColumnName("RoleID");
                        j.IndexerProperty<int>("PermissionId").HasColumnName("PermissionID");
                    });
        });

        modelBuilder.Entity<SiteStatistic>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__SiteStat__3214EC07341DC7E2");

            entity.Property(e => e.UpdatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.UserId).HasName("PK__Users__1788CCAC4AF525FC");

            entity.HasIndex(e => e.Username, "UQ__Users__536C85E493DB0A96").IsUnique();

            entity.Property(e => e.UserId).HasColumnName("UserID");
            entity.Property(e => e.CreatedAt)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.FacultyId).HasColumnName("FacultyID");
            entity.Property(e => e.FullName).HasMaxLength(100);
            entity.Property(e => e.PasswordHash).HasMaxLength(255);
            entity.Property(e => e.Phone).HasMaxLength(20);
            entity.Property(e => e.RoleId).HasColumnName("RoleID");
            entity.Property(e => e.Status).HasDefaultValue(true);
            entity.Property(e => e.Username).HasMaxLength(50);

            entity.HasOne(d => d.Faculty).WithMany(p => p.Users)
                .HasForeignKey(d => d.FacultyId)
                .HasConstraintName("FK_Users_Faculty");

            entity.HasOne(d => d.Role).WithMany(p => p.Users)
                .HasForeignKey(d => d.RoleId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Users_Role");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
