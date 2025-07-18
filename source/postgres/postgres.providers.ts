import { FactoryProvider, Provider, ValueProvider } from '@nestjs/common';
import { Client } from 'pg';
import { Umzug } from 'umzug';
import { MigrationsDiscovery } from '../migrations/migrations.discovery';
import { MigrationsLogger } from '../migrations/migrations.logger';
import { UMZUG_PROVIDER_KEY } from '../migrations/migrations.tokens';
import { MigrationPostgresAsync, MigrationPostgresFactory } from './postgres.interfaces';
import { PostgresStorage } from './postgres.storage';
import { POSTGRES_CLIENT, POSTGRES_CONFIG } from './postgres.tokens';
import { MigrationPostgresConfig } from './postgres.types';

export class PostgresProviders {
    public static getOptions(params: MigrationPostgresConfig): ValueProvider<MigrationPostgresConfig> {
        return {
            provide: POSTGRES_CONFIG,
            useValue: params,
        };
    }

    public static getAsyncOptions(options: MigrationPostgresAsync): Provider<MigrationPostgresConfig> {
        if (options.useFactory) {
            return {
                provide: POSTGRES_CONFIG,
                useFactory: options.useFactory,
                inject: options.inject,
            };
        }
        if (options.useExisting) {
            return {
                provide: POSTGRES_CONFIG,
                useFactory: async(factory: MigrationPostgresFactory): Promise<MigrationPostgresConfig> => {
                    const client = await factory.createUmzugPostgres();
                    return client;
                },
                inject: [options.useExisting],
            };
        }
        throw new Error('Must provide useFactory or useClass');
    }

    public static getClient(): FactoryProvider<Client> {
        return {
            provide: POSTGRES_CLIENT,
            useFactory: (configuration: MigrationPostgresConfig): Client => {
                const client = new Client(configuration.connection);
                return client;
            },
            inject: [
                POSTGRES_CONFIG,
            ],
        };
    }

    public static getUmzug(): FactoryProvider<Umzug> {
        return {
            provide: UMZUG_PROVIDER_KEY,
            useFactory: (
                configuration: MigrationPostgresConfig,
                discovery: MigrationsDiscovery,
                persistence: PostgresStorage,
            ): Umzug => {
                const migrations = discovery.explore();
                const instance = new Umzug({
                    migrations,
                    logger: new MigrationsLogger(),
                    storage: persistence,
                    create: {
                        folder: configuration.generating?.path,
                    },
                });
                return instance;
            },
            inject: [
                POSTGRES_CONFIG,
                MigrationsDiscovery,
                PostgresStorage,
            ],
        };
    }
}
