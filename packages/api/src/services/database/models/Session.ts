import {DataTypes, Model, Sequelize} from 'sequelize';
import User from './User';

export interface ISession {
  id: string;
  owner: number;
  token: string;
  expires: Date;
}

export type ISessionCreate = Omit<ISession, 'id'>;

export default class Session extends Model<ISession, ISessionCreate> {
  declare public getUser: () => Promise<User>;

  static doInit(sql: Sequelize) {
    Session.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      owner: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    }, {
      sequelize: sql,
      modelName: 'sessions',
    });
  }
}
