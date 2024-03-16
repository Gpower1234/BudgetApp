'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class monthlybudget extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  monthlybudget.init({
    id: DataTypes.INTEGER,
    user: DataTypes.STRING,
    year: DataTypes.INTEGER,
    month: DataTypes.STRING,
    currency: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'monthlybudget',
  });
  return monthlybudget;
};