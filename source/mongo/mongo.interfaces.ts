import { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Type } from '@nestjs/common';
import { MigrationMongoConfig } from './mongo.types';

export interface MigrationMongoSync extends MigrationMongoConfig {
    /**
     * Module scope
     */
    isGlobal?: boolean;
}

export interface MigrationMongoFactory {
    createUmzugMongo(): Promise<MigrationMongoConfig> | MigrationMongoConfig;
}

export interface MigrationMongoAsync extends Pick<ModuleMetadata, 'imports'> {
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    useExisting?: Type<MigrationMongoFactory>;
    useFactory?: (...args: any[]) => Promise<MigrationMongoConfig> | MigrationMongoConfig;
    isGlobal?: boolean;
}
