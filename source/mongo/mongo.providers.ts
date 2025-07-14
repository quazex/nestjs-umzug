import { FactoryProvider, Provider, ValueProvider } from '@nestjs/common';
import { Collection, MongoClient } from 'mongodb';
import { Umzug } from 'umzug';
import { MigrationsDiscovery } from '../migrations/migrations.discovery';
import { MigrationsLogger } from '../migrations/migrations.logger';
import { UMZUG_PROVIDER_KEY } from '../migrations/migrations.tokens';
import { MongoDefaults } from './mongo.defaults';
import { MigrationMongoAsync, MigrationMongoFactory } from './mongo.interfaces';
import { MongoStorage } from './mongo.storage';
import { MONGO_CLIENT, MONGO_COLLECTION, MONGO_CONFIG } from './mongo.tokens';
import { MigrationMongo } from './mongo.types';

export class MongoProviders {
    public static getOptions(params: MigrationMongo): ValueProvider<MigrationMongo> {
        return {
            provide: MONGO_CONFIG,
            useValue: params,
        };
    }

    public static getAsyncOptions(options: MigrationMongoAsync): Provider<MigrationMongo> {
        if (options.useFactory) {
            return {
                provide: MONGO_CONFIG,
                useFactory: options.useFactory,
                inject: options.inject,
            };
        }
        if (options.useExisting) {
            return {
                provide: MONGO_CONFIG,
                useFactory: async(factory: MigrationMongoFactory): Promise<MigrationMongo> => {
                    const client = await factory.createUmzugMongo();
                    return client;
                },
                inject: [options.useExisting],
            };
        }
        throw new Error('Must provide useFactory or useClass');
    }

    public static getClient(): FactoryProvider<MongoClient> {
        return {
            provide: MONGO_CLIENT,
            useFactory: (configuration: MigrationMongo): MongoClient => {
                const client = new MongoClient(configuration.uri, configuration.options);
                return client;
            },
            inject: [
                MONGO_CONFIG,
            ],
        };
    }

    public static getCollection(): FactoryProvider<Collection> {
        return {
            provide: MONGO_COLLECTION,
            useFactory: (
                config: MigrationMongo,
                client: MongoClient,
            ): Collection => {
                const name = config.collection ?? MongoDefaults.collection;
                return client.db().collection(name);
            },
            inject: [
                MONGO_CONFIG,
                MONGO_CLIENT,
            ],
        };
    }

    public static getUmzug(): FactoryProvider<Umzug> {
        return {
            provide: UMZUG_PROVIDER_KEY,
            useFactory: (
                configuration: MigrationMongo,
                discovery: MigrationsDiscovery,
                persistence: MongoStorage,
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
                MONGO_CONFIG,
                MigrationsDiscovery,
                MongoStorage,
            ],
        };
    }
}
