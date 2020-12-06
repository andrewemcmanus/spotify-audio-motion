'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class add_preview_url extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  add_preview_url.init({
    preview_url: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'add_preview_url',
  });
  return add_preview_url;
};