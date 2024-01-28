require('dotenv').config();
const axiosPayment = require('./axios.config.js');
const jwt = require('jsonwebtoken');
const BASE_URL = '/api';

exports.createPaymentAccount = async (userInfo) => {
    const { username, userId } = userInfo;
    try {
        const apiRes = await axiosPayment.post(`${BASE_URL}/create-account`, {
            username,
            userId,
        });
        if (apiRes.status === 201) {
            return true;
        }
        return false;
    } catch (error) {
        console.error('Function createAccount Payment Error: ', error);
        return false;
    }
};

exports.getUserBalance = async (userId) => {
    try {
        const apiRes = await axiosPayment.get(`${BASE_URL}/balance/${userId}`);
        return Number(apiRes?.data?.balance);
    } catch (error) {
        console.error('Function getUserBalance Error: ', error);
        throw error;
    }
};

exports.checkAccount = async ({ userId, totalMoney }) => {
    try {
        const apiRes = await axiosPayment.get(`${BASE_URL}/check-account?userId=${userId}&totalMoney=${totalMoney}`);
        return apiRes?.data?.accountId;
    } catch (error) {
        console.error('Function checkAccount Error: ', error);
        throw error;
    }
};

exports.postPayment = async ({ token }) => {
    try {
        const apiRes = await axiosPayment.post(`${BASE_URL}/payment`, {
            token
        });
        return apiRes?.data;
    } catch (error) {
        console.log('Function postPayment Axios ERROR: ', error);
        if (error.response) {
            return error.response.data;
        } else if (error.request) {
            return error.request;
        } else {
            return error.message;
        }
    }
};
