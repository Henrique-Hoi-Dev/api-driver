import Driver from '../models/Driver';
import Notifications from '../models/Notification';
import OneSignalProvider from '../providers/oneSignal';

export default {
  async getAll(driverId) {
    const checkIsDriver = await Driver.findOne({
      where: { id: driverId, type_positions: 'COLLABORATOR' },
    });
    if (!checkIsDriver) throw Error('User not is Driver');

    const listOneSigal = await OneSignalProvider.listNotifications();
    const list = listOneSigal.notifications.map((item) => ({
      title: item.headings,
      name: item.name,
      text: item.contents,
    }));
    console.log('list::::::::::::', list);
    const notifications = await Notifications.findAll({
      where: { driver_id: driverId, read: false },
      order: [['created_at', 'DESC']],
      attributes: ['id', 'content', 'read', 'created_at'],
    });

    return {
      dataResult: notifications,
    };
  },

  async update(id) {
    const notification = await Notifications.findByPk(id);
    if (!notification) throw Error('NOTIFICATION_NOT_FOUND');

    if (notification.driver_id === null)
      throw Error('Do not have permission for this notification');

    if (notification.read === true) throw Error('Has already been read.');

    await notification.update({ read: true });

    return { msg: 'successful' };
  },

  async markAllRead(driverId) {
    try {
      if (!driverId) throw Error('DRIVERID_NOT_FOUND');

      const notifications = await Notifications.findAll({
        where: { driver_id: driverId },
      });

      if (!notifications || notifications.length === 0)
        return { msg: 'NOTIFICATION_NOT_FOUND' };

      // Atualiza todas as notificações para read: true de uma só vez
      await Notifications.update(
        { read: true },
        { where: { driver_id: driverId } }
      );

      return { msg: 'successful' };
    } catch (error) {
      throw Error(error);
    }
  },

  async activateReceiveNotifications(body, driverId) {
    const driver = await Driver.findByPk(driverId);
    if (!driver) throw Error('DRIVER_NOT_FOUND');

    const data = {
      player_id: body.player_id,
    };

    await driver.update(data);

    return { msg: 'successful' };
  },
};
