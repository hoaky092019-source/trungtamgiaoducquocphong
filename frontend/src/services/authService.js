import axiosClient from './axiosClient';


const ENDPOINT = '/Auth';

class AuthService {
    async login(username, password) {
        try {

            const response = await axiosClient.post(`${ENDPOINT}/login`, { username, password });


            if (response.data) {

                const loginData = response.data;
                if (!loginData) throw new Error("Invalid response format");

                // Lưu thời gian hết hạn token (3 giờ từ bây giờ)
                const expiresAt = Date.now() + (3 * 60 * 60 * 1000); // 3 giờ
                loginData.expiresAt = expiresAt;

                localStorage.setItem("user", JSON.stringify(loginData));
                return response.data;
            } else {
                throw new Error(response.message || "Login failed");
            }
        } catch (error) {

            if (error.response && error.response.data) {
                throw new Error(error.response.data.message || "Server error occurred.");
            }
            throw new Error("Lỗi kết nối Server!");
        }
    }

    logout() {
        localStorage.removeItem("user");

        // Chỉ chuyển về /login nếu đang ở trang admin
        if (window.location.pathname.startsWith('/admin')) {
            window.location.href = "/login";
        } else {
            // Ở trang public, reload để hiển thị như khách
            window.location.reload();
        }
    }

    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    }

    getToken() {
        const user = this.getCurrentUser();
        return user?.token || null;
    }

    hasPermission(permissionName) {
        const user = this.getCurrentUser();

        // If no user, definitely no permission
        if (!user) return false;

        // Check properties in both camelCase (default .NET Core) and PascalCase
        const role = user.roleName || user.RoleName;
        const permissions = user.permissions || user.Permissions;

        // Admin override
        if (role === 'Admin' || role === 'Administrator') return true;

        // Check permissions list
        if (!permissions || !Array.isArray(permissions)) return false;

        return permissions.includes(permissionName);
    }

    // Kiểm tra token đã hết hạn chưa
    isTokenExpired() {
        const user = this.getCurrentUser();
        if (!user || !user.expiresAt) return true;
        return Date.now() >= user.expiresAt;
    }

    // Bắt đầu kiểm tra tự động token hết hạn
    startTokenExpirationCheck() {
        // Kiểm tra mỗi 10 giây
        const intervalId = setInterval(() => {
            const user = this.getCurrentUser();

            // Nếu không có user (đã đăng xuất hoặc chưa login) -> Dừng interval
            if (!user) {
                clearInterval(intervalId);
                return;
            }

            // Nếu có user và token đã hết hạn -> Đăng xuất 1 lần và dừng interval
            if (this.isTokenExpired()) {
                console.log("Token đã hết hạn, tự động đăng xuất...");
                clearInterval(intervalId); // Dừng interval TRƯỚC khi logout
                this.logout();
            }
        }, 10000); // Kiểm tra mỗi 10 giây

        return intervalId;
    }
}

const authService = new AuthService();
export default authService;