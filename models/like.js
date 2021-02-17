'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class like extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.like.belongsTo(models.user);
    }
  };
  like.init({
    songId: DataTypes.STRING,
    name: DataTypes.STRING,
    artist: DataTypes.STRING,
    userId: DataTypes.INTEGER,
    preview_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'like',
  });
  return like;
};
