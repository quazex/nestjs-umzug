import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        tsconfigPaths({
            configNames: [
                "tsconfig.build.json",
            ]
        }),
        dts({
            tsconfigPath: "tsconfig.build.json",
        }),
    ],
    build: {
        ssr: true,
        target: 'node18', // или ваша версия
        outDir: 'lib',
        sourcemap: false,
        lib: {
            entry: 'source/index.ts',
            formats: ['cjs'],
        },
        rollupOptions: {
            external: [
                'nestjs',
                'reflect-metadata',
            ],
            output: {
                preserveModules: true, // Сохраняет структуру папок
                preserveModulesRoot: 'source', // Убирает src из путей
                entryFileNames: '[name].js',
            },
        },
    },
});
