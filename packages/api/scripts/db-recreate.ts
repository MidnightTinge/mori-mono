import Grid from '../src/Grid';

(async () => {
  const grid = new Grid();
  await grid.db.start();
  await grid.db.sql.sync({
    force: true,
  });
  console.log('DB recreated');
})().catch(err => {
  console.error('!! FATAL !!', err);
  process.exit(1);
});
