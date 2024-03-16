'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class budget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  budget.init({
    id: DataTypes.INTEGER,
    user: DataTypes.STRING,
    name: DataTypes.STRING,
    currency: DataTypes.STRING,
    est_amount: DataTypes.INTEGER,
    month: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'budget',
  });
  return budget;
};