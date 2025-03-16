import HttpStatus from 'http-status';
import NotificationService from '../service/NotificationService';

class NotificationController {
  async getAll(req, res, next) {
    try {
      const data = await NotificationService.getAll(req.driverId);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async activateReceiveNotifications(req, res, next) {
    try {
      const data = await NotificationService.activateReceiveNotifications(
        req.body,
        req.driverId
      );
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async update(req, res, next) {
    try {
      const data = await NotificationService.update(req.params.id);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }

  async markAllRead(req, res, next) {
    try {
      const data = await NotificationService.markAllRead(req.driverId);
      return res.status(HttpStatus.OK).json(JSON.parse(JSON.stringify(data)));
    } catch (error) {
      next(res.status(HttpStatus.BAD_REQUEST).json({ mgs: error.message }));
    }
  }
}

export default new NotificationController();
