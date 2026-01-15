import axiosClient from './axiosClient';

const ENDPOINT = '/Notifications';

class NotificationService {
    getMyNotifications() {
        return axiosClient.get(`${ENDPOINT}/mine`);
    }

    markAsRead(id) {
        return axiosClient.post(`${ENDPOINT}/read/${id}`);
    }

    markAllAsRead() {
        return axiosClient.post(`${ENDPOINT}/read-all`);
    }
}

export default new NotificationService();
