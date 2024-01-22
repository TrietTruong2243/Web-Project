const db = require('../models');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = db.User;

module.exports = {
    // [GET] /me
    profile: (req, res, next) => {

    },

    // [GET] /me/edit-profile
    getEditProfile: (req, res, next) => {

    },

    // [POST] /me/edit-profile
    postEditProfile: (req, res, next) => {

    },

    // [GET] /me/change-password
    getChangePassword: (req, res, next) => {

    },

    // [POST] /me/change-password
    postChangePassword: (req, res, next) => {

    },
}