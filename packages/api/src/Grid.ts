import HTTP from './services/http';
import CONFIG from 'config';

import makeLogger from './utils/logging';
import Database from './services/database';

// `config` wraps itself in a proxy that exposes the underlying app config. it's
// safe to re-cast.
const config: AppConfig = CONFIG;

export default class Grid {
  http: HTTP;
  db: Database;
  config: AppConfig;

  constructor() {
    this.config = config;
    this.db = new Database(this);
    this.http = new HTTP(this);
  }

  makeLogger(service: string, meta?: Record<string, string>) {
    return makeLogger(service, meta);
  }

  async run() {
    await this.db.start();
    await this.http.start();
  }
}
