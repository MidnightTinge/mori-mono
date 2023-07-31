import Grid from '../Grid';
import Logger from 'bunyan';

export default abstract class IService {
  readonly #name: string;
  readonly #grid: Grid;
  readonly #logger: Logger;

  protected constructor(name: string, grid: Grid) {
    this.#name = name;
    this.#grid = grid;
    this.#logger = this.#grid.makeLogger(name, {service: name});
  }

  abstract start(): Promise<void>;

  async stop() {
    // stub
  }

  get name() {
    return this.#name;
  }

  get grid() {
    return this.#grid;
  }

  get config() {
    return this.#grid.config;
  }

  protected get logger() {
    return this.#logger;
  }
}
