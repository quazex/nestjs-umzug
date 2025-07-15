import { DynamicModule } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { MigrationsCommands } from '../migrations/migrations.commands';
import { MigrationsDiscovery } from '../migrations/migrations.discovery';
import { PostgresBootstrap } from './postgres.bootstrap';
import { MigrationPostgresAsync, MigrationPostgresSync } from './postgres.interfaces';
import { PostgresProviders } from './postgres.providers';
import { PostgresStorage } from './postgres.storage';

export class UmzugPostgresModule {
    public static forRoot({ isGlobal, ...params }: MigrationPostgresSync): DynamicModule {
        const OptionsProvider = PostgresProviders.getOptions(params);
        const ClientProvider = PostgresProviders.getClient();
        const UmzugProvider = PostgresProviders.getUmzug();

        const dynamicModule: DynamicModule = {
            global: isGlobal,
            module: UmzugPostgresModule,
            imports: [
                DiscoveryModule,
            ],
            providers: [
                OptionsProvider,
                ClientProvider,
                MigrationsDiscovery,
                MigrationsCommands,
                PostgresBootstrap,
                PostgresStorage,
                UmzugProvider,
            ],
            exports: [UmzugProvider],
        };

        return dynamicModule;
    }

    public static forRootAsync(params: MigrationPostgresAsync): DynamicModule {
        const OptionsProvider = PostgresProviders.getAsyncOptions(params);
        const ClientProvider = PostgresProviders.getClient();
        const UmzugProvider = PostgresProviders.getUmzug();

        const dynamicModule: DynamicModule = {
            global: params.isGlobal,
            module: UmzugPostgresModule,
            imports: [
                DiscoveryModule,
            ],
            providers: [
                OptionsProvider,
                ClientProvider,
                MigrationsDiscovery,
                MigrationsCommands,
                PostgresBootstrap,
                PostgresStorage,
                UmzugProvider,
            ],
            exports: [UmzugProvider],
        };

        if (Array.isArray(params.imports)) {
            dynamicModule.imports?.push(...params.imports);
        }

        return dynamicModule;
    }
}
