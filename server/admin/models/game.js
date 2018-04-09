'use strict';

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('game', {
    'gameName': {
      type: DataTypes.STRING,
    },
    'minPlayers': {
      type: DataTypes.INTEGER,
    },
    'maxPlayers': {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'game',
    
    timestamps: false,
    
  });

  Model.associate = (models) => {
  };

  return Model;
};

