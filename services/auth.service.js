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

  async sendMail(infoMail) {
    let transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false, // true for 465, false for other ports
      security: 'STARTTLS',
      auth: {
        //   user: testAccount.user, // generated ethereal user
        //   pass: testAccount.pass, // generated ethereal password
        user: 'ztlaqyq2yg4aiu3k@ethereal.email',
        pass: 'f8uYG7WXrfSGMQ9hU6',
      },
    });

    let info = await transporter.sendMail(infoMail);
    return { message: 'sent mail' };
  }

  async sendRecovery(email) {
    const user = await service.findByEmail(email);
    if (!user) {
      throw boom.unauthorized();
    }
    const payload = { sub: user.id };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '15min' });
    const link = `http://myfrontend.com/recovery?token=${token}`;
    await service.update(user.id, { recoveryToken: token });
    const mail = {
      from: 'ztlaqyq2yg4aiu3k@ethereal.email', // sender address
      to: 'ztlaqyq2yg4aiu3k@ethereal.email', // `${user.email}`
      subject: 'Recovery password email', // Subject line

      html: `<b>Recovery your password here => ${link}</b>`, // html body
    };
    const rta = await this.sendMail(mail);
    return rta;
  }

  //   async changePassword(token, newPassword) {
  //     try {
  //       const payload = jwt.verify(token, config.jwtSecret);
  //       const user = await service.findOne(payload.sub);
  //       console.log('usuario: ' + user);
  //       console.log('user.recoveryToken: ' + user.recoveryToken);
  //       console.log('Token: ' + token);
  //       console.log('iguales:? ' + user.recoveryToken === token);

  //       if (user.recoveryToken.trim() !== token.trim()) {
  //         throw boom.unauthorized();
  //       }
  //       const hash = await bcrypt.hash(newPassword, 10);
  //       await service.update(user.id, { recoveryToken: null, password: hash });
  //       return {
  //         message: 'password changed!',
  //       };
  //     } catch (error) {
  //       throw boom.unauthorized();
  //     }
  //   }
  async changePassword(token, newPassword) {
    try {
      const payload = jwt.verify(token, config.jwtSecret);
      const user = await service.findOne(payload.sub);
      console.log('usuario: ' + user);
      console.log('user.recoveryToken: ' + user.recoveryToken);
      console.log('Token: ' + token);
      console.log('iguales:? ' + user.recoveryToken === token);
      if (user.recoveryToken !== token) {
        throw boom.unauthorized();
      }
      const hash = await bcrypt.hash(newPassword, 10);
      await service.update(user.id, { recoveryToken: null, password: hash });
      return { message: 'password changed' };
    } catch (error) {
      throw boom.unauthorized();
    }
  }
}

module.exports = AuthService;
