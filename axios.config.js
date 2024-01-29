require('dotenv').config();
const axios = require('axios').default;
const {
    PAYMENT_SYS_URL,
    PAYMENT_SYS_AUTH_HEADER,
} = require('./constants.js');

const axiosPayment = axios.create({
    baseURL: PAYMENT_SYS_URL,
    headers: {  
        'Content-Type': 'application/json',
        [PAYMENT_SYS_AUTH_HEADER]: process.env.PAYMENT_PRIVATE_KEY,
    },
    withCredentials: true,
    paramsSerializer: (params) => queryString.stringify(params),
});

axiosPayment.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => {
        throw error;
    }
);

axiosPayment.interceptors.response.use(
    (res) => {
        return res;
    },
    (error) => {
        throw error;
    }
);

module.exports = axiosPayment;
