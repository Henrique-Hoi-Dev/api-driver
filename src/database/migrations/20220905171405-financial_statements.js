module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('financial_statements', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      driver_id: {
        type: Sequelize.INTEGER,
        references: { model: 'drivers', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      truck_id: {
        type: Sequelize.INTEGER,
        references: { model: 'trucks', key: 'id' },
        allowNull: true,
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      driver_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      invoicing: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      medium_fuel: {
        type: Sequelize.DOUBLE,
        allowNull: true,
      },
      start_trip: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('financial_statements');
  },
};
