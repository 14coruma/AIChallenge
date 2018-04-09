'use strict';

module.exports = (sequelize, DataTypes) => {
  var Model = sequelize.define('liveGame', {
    'live': {
      type: DataTypes.INTEGER,
    },
  }, {
    tableName: 'liveGame',
    
    timestamps: false,
    
  });

  Model.associate = (models) => {
    Model.belongsTo(models.game, {
      foreignKey: 'gameID',
      
      as: '_gameID',
    });
    
  };

  return Model;
};

