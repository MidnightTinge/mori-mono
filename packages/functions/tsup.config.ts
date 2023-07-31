import {defineConfig} from 'tsup';
export default defineConfig({
  entry: [
    'src/index.ts',
  ],
  splitting: false,
  dts: true,
  clean: true,
  sourcemap: true,
  format: ['esm', 'cjs'],
  outExtension({format}) {
    return {
      js: `.${format}.js`,
    };
  },
});
