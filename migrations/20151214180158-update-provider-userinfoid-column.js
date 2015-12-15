'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('providers', 'userId', 'userinfoId');
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.renameColumn('providers', 'userinfoId', 'userId');
  }
};
