const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const { config } = require('./../config/config');

const UserService = require('./user.service');
const service = new UserService();

class AuthService {
  constructor() {}

  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw boom.unauthorized();
    }
    delete user.dataValues.password;
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user,
      token,
    };
  }

  async sendMail(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        //   user: testAccount.user, // generated ethereal user
        //   pass: testAccount.pass, // generated ethereal password
        user: 'ztlaqyq2yg4aiu3k@ethereal.email',
        pass: 'f8uYG7WXrfSGMQ9hU6',
      },
    });

    let info = await transporter.sendMail({
      from: 'ztlaqyq2yg4aiu3k@ethereal.email', // sender address
      to: 'ztlaqyq2yg4aiu3k@ethereal.email', // `${user.email}`
      subject: 'Hello form node JS✔', // Subject line
      text: 'Hello world? this is a random text!!!', // plain text body
      html: '<b>Hello world? Hi there!!!!!</b>', // html body
    });
    return { message: 'sent mail' };
  }
}

module.exports = AuthService;
