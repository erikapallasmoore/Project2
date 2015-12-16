'use strict';

var geocoder = require('geocoder');

module.exports = function(sequelize, DataTypes) {
  var place = sequelize.define('place', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    hooks: {
      beforeCreate: function(place, options, callback) {
        geocoder.geocode(place.address, function(err, data) {
          if (err) {
            callback(err, null);
          }

          // if(data.results[0].geometry) {
            
          // }


          place.lat = data.results[0].geometry.location.lat;
          place.lng = data.results[0].geometry.location.lng;
          place.name = data.results[0].address_components[0].short_name;
          callback(null, place);
        });
      }
    }
  });
  return place;
};