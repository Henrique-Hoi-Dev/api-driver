import HttpStatus from 'http-status';
import FreightService from '../service/FreightService';
import { validateAndReturn } from '../utils/validFile';

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

  async uploadDocuments(req, res, next) {
    try {
      const data = await FreightService.uploadDocuments(req, req.params);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async deleteFile(req, res, next) {
    try {
      const data = await FreightService.deleteFile(req.params, req.query);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async getDocuments(req, res, next) {
    try {
      const { fileData, contentType } = await FreightService.getDocuments(
        req.query
      );
      res.set('Content-Type', validateAndReturn(contentType));
      return res.send(fileData);
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
