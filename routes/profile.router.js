const express = require('express');

const { config } = require('./../config/config');
const OrderService = require('../services/order.service');

const passport = require('passport');

const router = express.Router();
const service = new OrderService();

router.post(
  '/my-orders',
  passport.authenticate('jwt', { session: false }),
  async (req, res, next) => {
    try {
      const user = req.user;
      const orders = await service.findByUser(user.sub);
      res.json(orders);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
