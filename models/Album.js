import {sequelize} from "../dbConnect.js";
import {DataTypes, INTEGER, Sequelize} from "sequelize";

const Album = sequelize.define('AlbumModel', {
  album_id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.TEXT(), allowNull: false },
  image: { type: DataTypes.TEXT(), allowNull: false },
  user_id: { type: DataTypes.BIGINT, allowNull: false },
  created_at: {
    type: 'TIMESTAMP',
    defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {
  tableName: 'albums',
  timestamps: false
})

async function createTable(){
  await Album.sync({
    alter: true,
  });
}

createTable()

export { Album }