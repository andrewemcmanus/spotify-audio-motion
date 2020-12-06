'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.changeColumn('favorites', 'userId', { type: Sequelize.INTEGER });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    // await queryInterface.dropColumn
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
