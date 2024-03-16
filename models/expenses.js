'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class expenses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  expenses.init({
    id: DataTypes.INTEGER,
    user: DataTypes.STRING,
    item_name: DataTypes.STRING,
    currency: DataTypes.STRING,
    amount: DataTypes.INTEGER,
    month: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'expenses',
  });
  return expenses;
};