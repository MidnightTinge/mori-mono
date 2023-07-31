import {DataTypes, Model, Sequelize} from 'sequelize';
import User from './User';
import Forest from './Forest';

export interface ITree {
  id: number;
  content: string | null;
  forest: number;
}

export type ITreeCreate = Omit<ITree, 'id'>;

export default class Tree extends Model<ITree, ITreeCreate> {
  static doInit(sql: Sequelize) {
    Tree.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        content: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        forest: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize: sql,
        tableName: 'trees',
      },
    );
  }
}
