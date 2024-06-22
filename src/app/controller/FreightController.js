import HttpStatus from 'http-status';
import FreightService from '../service/FreightService';

class FreightController {
  async create(req, res, next) {
    try {
      const data = await FreightService.create(req.driverId, req.body);
      return res
        .status(HttpStatus.CREATED)
        .json(JSON.parse(JSON.stringify({ data })));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async getId(req, res, next) {
    try {
      const data = await FreightService.getId(req.params.id);
      return res
        .status(HttpStatus.OK)
        .json(JSON.parse(JSON.stringify({ data })));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async update(req, res, next) {
    try {
      const data = await FreightService.update(
        req.body,
        req.params.id,
        req.driverProps
      );
      return res
        .status(HttpStatus.OK)
        .json(JSON.parse(JSON.stringify({ data })));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async startingTrip(req, res, next) {
    try {
      const data = await FreightService.startingTrip(req.body, req.driverProps);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async finishedTrip(req, res, next) {
    try {
      const data = await FreightService.finishedTrip(req.body, req.driverProps);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async delete(req, res, next) {
    try {
      const data = await FreightService.delete(req.params.id);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }
}

export default new FreightController();
