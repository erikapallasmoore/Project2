'use strict';
module.exports = function(sequelize, DataTypes) {
  var userinfo = sequelize.define('userinfo', {
    user: DataTypes.STRING,
    password: DataTypes.STRING,
    favorite: DataTypes.INTEGER,
    instainfo: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        models.userinfo.hasMany(models.provider);
        // associations can be defined here
      }
    }
  });
  return userinfo;
};