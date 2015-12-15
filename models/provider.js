'use strict';
module.exports = function(sequelize, DataTypes) {
  var provider = sequelize.define('provider', {
    pid: DataTypes.STRING,
    token: DataTypes.STRING,
    type: DataTypes.STRING,
    userinfoId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        models.provider.belongsTo(models.userinfo)
        // associations can be defined here
      }
    }
  });
  return provider;
};