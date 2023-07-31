import IService from '../IService';
import Grid from '../../Grid';
import User from './models/User';
import {Model, Sequelize} from 'sequelize';
import Session from './models/Session';
import CodedError from '../../utils/CodedError';
import Tree from './models/Tree';
import Forest from './models/Forest';

export default class Database extends IService {
  #sql: Sequelize;

  constructor(grid: Grid) {
    super('databse', grid);
  }

  async start() {
    this.#sql = new Sequelize(this.grid.config.postgres);

    await this.#sql.authenticate();
    this.logger.info('Authenticated, initializing models');

    await this.initModels();
    this.logger.info('Models initialized');

    this.logger.info('DB Started');
  }

  private async initModels() {
    Session.doInit(this.#sql);
    User.doInit(this.#sql);

    Tree.doInit(this.#sql);
    Forest.doInit(this.#sql);

    await this.#sql.sync();
  }

  get sql() {
    return this.#sql;
  }

  /**
   * Unwrap a model, returning the data values, or undefined if the model is
   * nully.
   *
   * @param model The model to unwrap
   */
  static unwrap<T extends Model<any, any>>(model: T): UnwrapModel<T> {
    return model?.dataValues ?? undefined;
  }

  /**
   * Unwrap a model, throwing if the value is nully.
   *
   * @param model The model to unwrap.
   */
  static safeUnwrap<T extends Model<any, any>>(model: T): UnwrapModel<T> {
    if (model?.dataValues == null) {
      throw new CodedError(CodedError.GENERIC.notFound);
    }

    return Database.unwrap(model);
  }

  static unwrapAll<T extends Model<any, any>>(models: T[]): UnwrapModel<T>[] {
    return models.map(Database.unwrap);
  }

  static safeUnwrapAll<T extends Model<any, any>>(models: T[]): UnwrapModel<T>[] {
    if (models == null) {
      throw new CodedError(CodedError.GENERIC.notFound);
    }

    return models.map(Database.safeUnwrap);
  }

  /**
   * Unwrap a model and remove any sensitive keys from the result.
   *
   * @param model The model to unwrap.
   * @param keys The keys to remove.
   * @param safe Whether to throw if the model is nully.
   */
  static censor<T extends Model<any, any>, Y extends (keyof UnwrapModel<T>)[]>(model: T, keys: Y, safe = true): Omit<UnwrapModel<T>, UnwrapArray<Y>> {
    const unwrapped = safe ? Database.safeUnwrap(model) : Database.unwrap(model);
    if (!safe && unwrapped == null) {
      return undefined;
    }

    const filtered = Object
      .entries(unwrapped)
      .filter(([key]) => !keys.includes(key));

    return Object.fromEntries(filtered) as Omit<UnwrapModel<T>, UnwrapArray<Y>>;
  }
}
