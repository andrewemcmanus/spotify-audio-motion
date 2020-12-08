'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
await queryInterface.dropTable('favorites');
  },

  down: async (queryInterface, Sequelize) => {

  }
};
