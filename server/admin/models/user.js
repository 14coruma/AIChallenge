'use strict';

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('user', {
    'username': {
      type: DataTypes.STRING,
    },
    'password': {
      type: DataTypes.STRING,
    },
    'email': {
      type: DataTypes.STRING,
    },
    'wins': {
      type: DataTypes.INTEGER,
    },
    'losses': {
      type: DataTypes.INTEGER,
    },
    'confirmed': {
      type: DataTypes.STRING,
    },
    'signup_date': {
      type: DataTypes.DATE,
    },
  }, {
    tableName: 'user',
    underscored: true,
    timestamps: false,
    
  });

  Model.associate = (models) => {
  };

  return Model;
};

