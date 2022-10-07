import httpStatus from 'http-status-codes';

import Driver from '../app/models/Driver';
// import Notification from "../app/schemas/Notification";
import Notifications from "../app/models/Notification";

export default {
  async getAll(req, res) {
    let result = {}

    const checkIsDriver = await Driver.findOne({
      where: { id: req.userId, type_position: "collaborator" }
    })

    if (!checkIsDriver) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'User not is Driver' }      
      return result
    } 

    const notificationsDriver = await Notifications.findAll({
      where: { driver_id: req.userId },
      order: [["created_at", "DESC"]],
      attributes: [ 'id', 'content', 'read', 'created_at' ]
    })

    result = { httpStatus: httpStatus.OK, status: "successful", dataResult: notificationsDriver } 
    return result
  },

  async update(req, res) {   
    let result = {}

    const notificationReq = await Notifications.findByPk(res.id)

    if (!notificationReq) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Notification not found' }      
      return result
    }

    if (notificationReq.driver_id === null) {
      result = { httpStatus: httpStatus.BAD_REQUEST, msg: 'Do not have permission for this notification' }      
      return result
    }

    if (notificationReq.read === true) {
      result = {httpStatus: httpStatus.CONFLICT, dataResult: { msg: 'Has already been read.' }}      
      return result
    }

    await notificationReq.update({ read: true })

    result = { httpStatus: httpStatus.OK, status: "successful" }      
    return result
  },
}