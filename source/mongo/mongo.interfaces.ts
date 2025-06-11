import { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Type } from '@nestjs/common';
import { MigrationMongo } from './mongo.types';

export interface MigrationMongoFactory {
    createUmzugMongo(): Promise<MigrationMongo> | MigrationMongo;
}

export interface MigrationMongoAsync extends Pick<ModuleMetadata, 'imports'> {
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    useExisting?: Type<MigrationMongoFactory>;
    useFactory?: (...args: any[]) => Promise<MigrationMongo> | MigrationMongo;
}
