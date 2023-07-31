import Grid from './Grid';
import makeLogger from './utils/logging'

const logger = makeLogger('app')

new Grid().run().catch(err => {
  logger.fatal(err, 'Fatal error occurred while running the grid');
  process.exit(1);
});
