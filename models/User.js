import {sequelize} from "../dbConnect.js";
import {DataTypes, INTEGER} from "sequelize";

const User = sequelize.define('UserModel', {
  user_id: {type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true},
  email: {type: DataTypes.CHAR(100), allowNull: false, unique: true},
  password: {type: DataTypes.CHAR(200), allowNull: false},
  role_name: {type: DataTypes.ENUM('ROLE_COMPANY', 'ROLE_PERSONAL'), allowNull: false},
  status: {type: DataTypes.ENUM('deactivate', 'activate'), allowNull: false, defaultValue: 'deactivate'},
  code: {type: DataTypes.INTEGER, allowNull: true},
  code_date: {type: DataTypes.BIGINT, allowNull: true},
  first_name: {type: DataTypes.CHAR(50), allowNull: true},
  second_name: {type: DataTypes.CHAR(50), allowNull: true},
  company_name: {type: DataTypes.CHAR(50), allowNull: true},
  company_role: {type: DataTypes.CHAR(50), allowNull: true},
  avatar: {type: DataTypes.CHAR(200), allowNull: true},
  inn: {type: DataTypes.BIGINT, allowNull: true}
}, {tableName: 'users', timestamps: false});

// создаст таблицу в бд, если ее нет
async function createTable(){
  await User.sync({
    alter: true,
  });
}

createTable();

export { User };