import { InjectionToken, ModuleMetadata, OptionalFactoryDependency, Type } from '@nestjs/common';
import { MigrationPostgres } from './postgres.types';

export interface MigrationPostgresFactory {
    createUmzugPostgres(): Promise<MigrationPostgres> | MigrationPostgres;
}

export interface MigrationPostgresAsync extends Pick<ModuleMetadata, 'imports'> {
    name?: string;
    inject?: Array<InjectionToken | OptionalFactoryDependency>;
    useExisting?: Type<MigrationPostgresFactory>;
    useFactory?: (...args: any[]) => Promise<MigrationPostgres> | MigrationPostgres;
}
