import { Inject, Injectable } from '@nestjs/common';
import { StorageParams } from '@typing/storage.interfaces';
import { Collection } from 'mongodb';
import { UmzugStorage } from 'umzug';
import { v5 as UUIDv5 } from 'uuid';
import { MONGO_COLLECTION } from './mongo.tokens';
import { MongoDocument } from './mongo.types';

@Injectable()
export class MongoStorage implements UmzugStorage {
    constructor(
        @Inject(MONGO_COLLECTION) private readonly collection: Collection<MongoDocument>,
    ) {}

    public async executed(): Promise<string[]> {
        const documents = await this.collection.find().toArray();
        return documents.map((row) => row.name);
    }

    public async logMigration(params: StorageParams): Promise<void> {
        await this.collection.insertOne({
            _id: UUIDv5(params.name, UUIDv5.URL),
            name: params.name,
            timestamp: new Date(),
        });
    }

    public async unlogMigration(params: StorageParams): Promise<void> {
        await this.collection.deleteOne({
            name: params.name,
        });
    }
}
