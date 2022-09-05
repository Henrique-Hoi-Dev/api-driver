module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('drivers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      set: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      number_cnh: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      valid_cnh: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      valid_mopp: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cpf: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date_admission: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      date_birthday: {
        type: Sequelize.DATE,
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
    return queryInterface.dropTable('drivers');
  },
};
