import Driver from '../models/Driver';
import Notifications from '../models/Notification';
import OneSignalProvider from '../providers/oneSignal';

export default {
  async getAll(driverId, { page = 1, limit = 10 }) {
    const checkIsDriver = await Driver.findOne({
      where: { id: driverId, type_positions: 'COLLABORATOR' },
    });
    if (!checkIsDriver) throw Error('User not is Driver');

    const listOneSignal = await OneSignalProvider.listNotifications();
    const oneSignalList = listOneSignal.notifications.map((item) => ({
      title: item.headings,
      name: item.name,
      text: item.contents,
    }));
    console.log('OneSignal notifications:', oneSignalList);

    // Busca notificações locais do banco com paginação
    const notifications = await Notifications.findAll({
      where: { driver_id: driverId },
      order: [['created_at', 'DESC']],
      limit,
      offset: page - 1 ? (page - 1) * limit : 0,
      attributes: ['id', 'content', 'read', 'created_at'],
    });

    // Conta o total de notificações para calcular as páginas
    const totalNotifications = await Notifications.count({
      where: { driver_id: driverId },
    });
    const totalPages = Math.ceil(totalNotifications / limit);

    return {
      data: notifications,
      total: totalNotifications,
      totalPages,
      currentPage: Number(page),
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
