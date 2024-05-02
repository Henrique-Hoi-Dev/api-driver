import HttpStatus from 'http-status';
import RestockService from '../service/RestockService';

class RestockController {
  async create(req, res, next) {
    try {
      const data = await RestockService.create(req.driverId, req.body);
      return res
        .status(HttpStatus.CREATED)
        .json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(error.status).json({ mgs: error.message }));
    }
  }

  async getAll(req, res, next) {
    try {
      const data = await RestockService.getAll(req.query);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async getId(req, res, next) {
    try {
      const data = await RestockService.getId(req.params.id);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }
}

export default new RestockController();
