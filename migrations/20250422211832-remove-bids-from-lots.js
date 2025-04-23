'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Удаляем колонку 'bids' из таблицы 'lots'
    await queryInterface.removeColumn('lots', 'bids');
  },

  async down(queryInterface, Sequelize) {
    // Восстанавливаем колонку 'bids' в таблице 'lots' (если миграция будет откатана)
    await queryInterface.addColumn('lots', 'bids', {
      type: Sequelize.JSON,
      defaultValue: [],
      allowNull: true,
    });
  }
};