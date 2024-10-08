'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Проверяем, существует ли столбец isVerified
    const columnExists = await queryInterface.describeTable('Users');
    if (!columnExists.isVerified) {
      await queryInterface.addColumn('Users', 'isVerified', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      });
    }
    if (!columnExists.twoFactorSecret) {
      await queryInterface.addColumn('Users', 'twoFactorSecret', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'isVerified');
    await queryInterface.removeColumn('Users', 'twoFactorSecret');
  },
};
