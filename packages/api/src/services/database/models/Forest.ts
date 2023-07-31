import {DataTypes, Model, Sequelize} from 'sequelize';
import User from './User';
import Tree from './Tree';

export interface IForest {
  id: number;
  name: string;
  owner: number;
  description: string | null;
}

export type IForestCreate = Omit<IForest, 'id'>;

export default class Forest extends Model<IForest, IForestCreate> {
  static doInit(sql: Sequelize) {
    Forest.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        owner: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize: sql,
        tableName: 'forests',
      },
    );
    Forest.hasMany(User, {
      foreignKey: 'owner',
      as: 'forestOwner',
    });
    Forest.hasMany(Tree, {
      foreignKey: 'forest',
      as: 'forestTrees',
    });
    Tree.belongsTo(Forest, {
      foreignKey: 'forest',
      as: 'treeForest',
    });
  }
}
