import HttpStatus from 'http-status';
import DriverService from '../service/DriverService';

class DriverController {
  async profile(req, res, next) {
    try {
      const data = await DriverService.profile(req.driverId);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async update(req, res, next) {
    try {
      const data = await DriverService.update(req.driverId, req.body);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async requestCodeValidation(req, res, next) {
    try {
      const data = await DriverService.requestCodeValidation(req.body);
      return res
        .status(HttpStatus.OK)
        .json(JSON.parse(JSON.stringify({ data: data })));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async validCodeForgotPassword(req, res, next) {
    try {
      const data = await DriverService.validCodeForgotPassword(req.body);
      return res
        .status(HttpStatus.OK)
        .json(JSON.parse(JSON.stringify({ data: data })));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async forgotPassword(req, res, next) {
    try {
      const data = await DriverService.forgotPassword(req.body);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }
}

export default new DriverController();
