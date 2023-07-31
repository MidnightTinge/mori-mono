import {DataTypes, Model, Sequelize} from 'sequelize';
import User from './User';

export interface ITag {
  id: number;
  name: string;
  description: string | null;
  // A tag belongs to many items through (tagged_items.tag_id=$TagId)
}

export type ITagCreate = Omit<ITag, 'id'>;

export default class Tag extends Model<ITag, ITagCreate> {
  static doInit(sql: Sequelize) {
    Tag.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    }, {
      modelName: 'tags',
      sequelize: sql,
    });
  }
}
