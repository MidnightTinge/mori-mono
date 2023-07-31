import sequelize, {DataTypes, Model, Sequelize} from 'sequelize';
import Session from './Session';

export interface IUser {
  id: number;
  username: string;
  password: string;
}

export type IUserCreate = Omit<IUser, 'id'>;

export default class User extends Model<IUser, IUserCreate> {
  declare public getSessions: () => Promise<Session[]>; // TODO: is there a way to get these types without explicit declaration?

  static doInit(sql: Sequelize) {
    User.init({
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      sequelize: sql,
      modelName: 'users',
      indexes: [
        {
          type: 'UNIQUE',
          name: 'users_username_unique',
          fields: [sequelize.fn('lower', sequelize.col('username'))],
        },
        {
          name: 'users_username_idx',
          fields: ['username'],
        },
      ],
    });
    User.hasMany(Session, {
      foreignKey: 'owner',
      as: 'sessions',
    });
    Session.belongsTo(User, {
      foreignKey: 'owner',
      as: 'user',
    });
  }
}
