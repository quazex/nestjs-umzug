import { DynamicModule } from '@nestjs/common';
import { DiscoveryModule } from '@nestjs/core';
import { MigrationsCommands } from '../migrations/migrations.commands';
import { MigrationsDiscovery } from '../migrations/migrations.discovery';
import { MongoBootstrap } from './mongo.bootstrap';
import { MigrationMongoAsync, MigrationMongoSync } from './mongo.interfaces';
import { MongoProviders } from './mongo.providers';
import { MongoStorage } from './mongo.storage';

export class UmzugMongoModule {
    public static forRoot({ isGlobal, ...params }: MigrationMongoSync): DynamicModule {
        const OptionsProvider = MongoProviders.getOptions(params);
        const ClientProvider = MongoProviders.getClient();
        const CollProvider = MongoProviders.getCollection();
        const UmzugProvider = MongoProviders.getUmzug();

        const dynamicModule: DynamicModule = {
            global: isGlobal,
            module: UmzugMongoModule,
            imports: [
                DiscoveryModule,
            ],
            providers: [
                OptionsProvider,
                ClientProvider,
                CollProvider,
                MigrationsDiscovery,
                MigrationsCommands,
                MongoBootstrap,
                MongoStorage,
                UmzugProvider,
            ],
            exports: [UmzugProvider],
        };

        return dynamicModule;
    }

    public static forRootAsync(params: MigrationMongoAsync): DynamicModule {
        const OptionsProvider = MongoProviders.getAsyncOptions(params);
        const ClientProvider = MongoProviders.getClient();
        const CollProvider = MongoProviders.getCollection();
        const UmzugProvider = MongoProviders.getUmzug();

        const dynamicModule: DynamicModule = {
            global: params.isGlobal,
            module: UmzugMongoModule,
            imports: [
                DiscoveryModule,
            ],
            providers: [
                OptionsProvider,
                ClientProvider,
                CollProvider,
                MigrationsDiscovery,
                MigrationsCommands,
                MongoBootstrap,
                MongoStorage,
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
