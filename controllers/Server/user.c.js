const db = require('../../models/Server');
const bcrypt = require('bcrypt');
const { Op, UniqueConstraintError } = require('sequelize');
const cloudinary = require('../../config/cloudinary');
const toDataUri = require('../../helpers/dataUriConverter');
const User = db.User;
const Image = db.Image;

module.exports = {
    // [GET] /:role
    showAll: (role) => {
        return async (req, res, next) => {
            try {
                let { page, size, status, sortBy, sortDir, email, username, fullname, phone, address, createdAtFrom, createdAtTo, updatedAtFrom, updatedAtTo } = req.query;
                page = page || 1;
                size = size || 10;
                sortBy = sortBy || 'id';
                sortDir = sortDir || 'asc';
                let filters = { role };

                if (status) {
                    filters.status = status;
                }
                if (email) {
                    filters.email = {
                        [Op.like]: `%${email}%`
                    }
                }
                if (username) {
                    filters.username = {
                        [Op.like]: `%${username}%`
                    }
                }
                if (fullname) {
                    filters.fullname = {
                        [Op.like]: `%${fullname}%`
                    }
                }
                if (phone) {
                    filters.phone = {
                        [Op.like]: `%${phone}%`
                    }
                }
                if (address) {
                    filters.address = {
                        [Op.like]: `%${address}%`
                    }
                }
                if (createdAtFrom || createdAtTo) {
                    createdAtFrom = new Date(createdAtFrom);
                    createdAtTo = new Date(createdAtTo);
                    createdAtFrom.setHours(0, 0, 0, 0);
                    createdAtTo.setHours(23, 59, 59, 999);
                    filters.createdAt = {
                        [Op.between]: [createdAtFrom || '1970-01-01', createdAtTo || '9999-12-31']
                    }
                }
                if (updatedAtFrom || updatedAtTo) {
                    updatedAtFrom = new Date(updatedAtFrom);
                    updatedAtTo = new Date(updatedAtTo);
                    updatedAtFrom.setHours(0, 0, 0, 0);
                    updatedAtTo.setHours(23, 59, 59, 999);
                    filters.updatedAt = {
                        [Op.between]: [updatedAtFrom || '1970-01-01', updatedAtTo || '9999-12-31']
                    }
                }

                const users = await User.findAll({
                    where: filters,
                    order: [
                        [sortBy, sortDir]
                    ],
                    limit: size,
                    offset: (page - 1) * size
                });
                for (let i = 0; i < users.length; ++i) {
                    const image = await Image.findOne({
                        where: {
                            userId: users[i].id
                        }
                    });
                    users[i] = users[i].dataValues;
                    users[i].imageUrl = image ? image.url : null;
                }
                for (let i = 0; i < users.length; ++i) {
                    const createdAt = new Date(users[i].createdAt);
                    const updatedAt = new Date(users[i].updatedAt);
                    const formattedCreatedAt = `${createdAt.getDate()}-${createdAt.getMonth() + 1}-${createdAt.getFullYear()} ${createdAt.getHours()}:${createdAt.getMinutes()}`;
                    const formattedUpdatedAt = `${updatedAt.getDate()}-${updatedAt.getMonth() + 1}-${updatedAt.getFullYear()} ${updatedAt.getHours()}:${updatedAt.getMinutes()}`;
                    users[i].formattedCreatedAt = formattedCreatedAt;
                    users[i].formattedUpdatedAt = formattedUpdatedAt;
                }

                let urlParams = (new URLSearchParams(req.query));
                urlParams.delete('page');

                let active = {};
                if (role === 'admin') {
                    active = { Administrators: true };
                } else if (role === 'customer') {
                    active = { Customers: true };
                }

                res.render('user/list-user', {
                    active,
                    users,
                    total: users.length,
                    page,
                    queryObj: req.query,
                    urlParams: urlParams.toString()
                });
            } catch (err) {
                next(err);
            }
        }
    },

    // [GET] /customer/create-new
    getCreateUser: async (req, res, next) => {
        try {
            res.render('user/editable-user', {
                active: { Customers: true },
                editable: false,
                action: 'create'
            });
        } catch (err) {
            next(err);
        }
    },

    // [POST] /customer
    createUser: async (req, res, next) => {
        try {
            const { email, username, password, fullname, phone, address, role } = req.body;
            const image = req.file;

            // create new user
            const hash = await bcrypt.hash(password, 10);
            const user = await User.create({
                email,
                username,
                password: hash,
                fullname,
                phone,
                address,
                role
            });

            // create and upload image to cloudinary 
            if (image) {
                const imageDataUri = toDataUri(image);
                const result = await cloudinary.uploader.upload(imageDataUri, {
                    folder: 'HCMUS-Ecommerce/users'
                });
                const newImage = await Image.create({
                    url: result.secure_url,
                    public_id: result.public_id,
                    userId: user.id
                });
                console.log(newImage);
            }

            res.redirect('/customer');
        } catch (err) {
            if (err instanceof UniqueConstraintError) {
                res.render('user/editable-user', {
                    active: { Customers: true },
                    editable: false,
                    user: req.body,
                    message: 'Username already exists'
                });
            }
            else next(err);
        }
    },

    // [GET] /customer/edit/:id
    getEditUser: async (req, res, next) => {
        try {
            const id = req.params.id;
            let user = await User.findByPk(id);
            const image = await Image.findOne({
                where: {
                    userId: id
                }
            });
            user = user.dataValues;
            user.imageUrl = image ? image.url : null;
            res.render('user/editable-user', {
                active: { Customers: true },
                editable: true,
                user
            });
        } catch (err) {
            next(err);
        }
    },

    // [POST] /customer/edit/:id
    postEditUser: async (req, res, next) => {
        try {
            const id = req.params.id;
            const { email, username, oldPassword, password, fullname, phone, address, role } = req.body;
            let image = req.file;

            // check if old password is correct
            let user = await User.findByPk(id);
            const oldImage = await Image.findOne({
                where: {
                    userId: id
                }
            });

            if (oldPassword && password) {
                const match = await bcrypt.compare(oldPassword, user.password);
                if (!match) {
                    res.render('user/editable-user', {
                        active: { Customers: true },
                        editable: true,
                        user: req.body,
                        imageUrl: oldImage ? oldImage.url : null,
                        message: 'Old password is incorrect'
                    });
                    return;
                }
            }

            // update user
            const hash = await bcrypt.hash(password, 10);
            user = await user.update({
                email,
                username,
                password: hash,
                fullname,
                phone,
                address,
                role
            }, {
                where: {
                    id
                }
            });

            // if there is new image, delete old user's image, create and upload new image to cloudinary
            if (user && image) {
                console.log(image);
                const imageDataUri = toDataUri(image);
                const result = await cloudinary.uploader.upload(imageDataUri, {
                    folder: 'HCMUS-Ecommerce/users'
                });

                // delete old image
                if (oldImage) {
                    await cloudinary.uploader.destroy(oldImage.public_id);
                    await Image.destroy({
                        where: {
                            userId: id
                        }
                    });
                }

                // create new image
                await Image.create({
                    url: result.secure_url,
                    public_id: result.public_id,
                    userId: user.id
                });
            }

            res.redirect('/customer');
        } catch (err) {
            if (err instanceof UniqueConstraintError) {
                res.render('user/editable-user', {
                    active: { Customers: true },
                    editable: true,
                    user: req.body,
                    message: 'Username already exists'
                });
            }
            else next(err);
        }
    },

    // [POST] /:role/:id
    handleSingleItem: async (req, res, next) => {
        try {
            const id = req.params.id;
            const { action } = req.body;
            if (action === 'delete') {
                // delete image
                const image = await Image.findOne({
                    where: {
                        userId: id
                    }
                });
                if (image) {
                    await cloudinary.uploader.destroy(image.public_id);
                }
                await Image.destroy({
                    where: {
                        userId: id
                    }
                });
                await User.destroy({
                    where: {
                        id
                    }
                });
            }
            else if (action === 'changeToCustomer') {
                const user = await User.update({ role: 'customer' }, {
                    where: {
                        id
                    }
                });
            } else if (action === 'changeToAdmin') {
                const user = await User.update({ role: 'admin' }, {
                    where: {
                        id
                    }
                });
            } else if (action === 'activate') {
                const user = await User.update({ status: 'active' }, {
                    where: {
                        id
                    }
                });
            } else if (action === 'ban') {
                const admin = await User.update({ status: 'banned' }, {
                    where: {
                        id
                    }
                });
            }
            res.redirect('/admin/back');
        } catch (err) {
            next(err);
        }
    },

    // [POST] /:role/multiselect-handle
    handleMultiItems: async (req, res, next) => {
        try {
            const { action, selectedItems } = req.body;
            if (action === 'delete') {
                // delete images
                const images = await Image.findAll({
                    where: {
                        userId: selectedItems
                    }
                });
                for (let i = 0; i < images.length; ++i) {
                    await cloudinary.uploader.destroy(images[i].public_id);
                }
                await Image.destroy({
                    where: {
                        userId: selectedItems
                    }
                });
                await User.destroy({
                    where: {
                        id: selectedItems
                    }
                });
            } else if (action === 'changeToCustomer') {
                console.log(selectedItems);
                const users = await User.update({ role: 'customer' }, {
                    where: {
                        id: selectedItems
                    }
                });
            } else if (action === 'changeToAdmin') {
                const users = await User.update({ role: 'admin' }, {
                    where: {
                        id: selectedItems
                    }
                });
            } else if (action === 'activate') {
                const users = await User.update({ status: 'active' }, {
                    where: {
                        id: selectedItems
                    }
                });
            } else if (action === 'ban') {
                const users = await User.update({ status: 'banned' }, {
                    where: {
                        id: selectedItems
                    }
                });
            }
            res.redirect('/admin/back');
        } catch (err) {
            next(err);
        }
    },

    // api
    // [GET] /check-username/:username
    checkUsername: async (req, res, next) => {
        try {
            const { username } = req.params;
            const user = await User.findOne({
                where: {
                    username
                }
            });
            console.log(user);
            if (user) {
                res.json({ valid: false });
            } else {
                res.json({ valid: true });
            }
        } catch (err) {
            next(err);
        }
    },

}