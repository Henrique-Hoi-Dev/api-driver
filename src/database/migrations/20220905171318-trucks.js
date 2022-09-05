module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('trucks', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      truck_models: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      truck_board: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      truck_km: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      truck_year: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('trucks');
  },
};
