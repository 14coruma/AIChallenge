'use strict';

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('gameQueue', {
  }, {
    tableName: 'gameQueue',
    
    timestamps: false,
    
  });

  Model.associate = (models) => {
    Model.belongsTo(models.game, {
      foreignKey: 'gameID',
      
      as: '_gameID',
    });
    
    Model.belongsTo(models.user, {
      foreignKey: 'userID',
      
      as: '_userID',
    });
    
  };

  return Model;
};

