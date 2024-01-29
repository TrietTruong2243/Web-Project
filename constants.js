module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'JWT_SECRET',
    JWT_AUTHOR: 'Ecommerce Project',
    JWT_COOKIE_KEY: 'access_token',

    PAYMENT_SYS_URL: process.env.PAYMENT_SYS_URL,
    PAYMENT_SYS_AUTH_HEADER: 'payment-token',
    PAYMENT_SYS_AUTH_PRIVATE_KEY: 'payment-private-key',
    PAYMENT_TRACKING_QUERY_KEY: 'fid',
    API_AUTH_HEADER: 'payment-token',
};
