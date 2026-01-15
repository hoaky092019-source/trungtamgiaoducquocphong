import axiosClient from './axiosClient';

const dashboardService = {
    getStats: () => axiosClient.get('/Dashboard/stats')
};

export default dashboardService;
