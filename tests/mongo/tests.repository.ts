import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectMongoClient } from '@quazex/nestjs-mongodb';
import { Collection, MongoClient } from 'mongodb';
import { TestsDoc } from './tests.types';

@Injectable()
export class TestsRepository implements OnModuleInit, OnModuleDestroy {
    private readonly collection: Collection<TestsDoc>;

    constructor(@InjectMongoClient() private readonly client: MongoClient) {
        this.collection = client.db().collection('test_coll');
    }

    public async onModuleInit(): Promise<void> {
        await this.client.connect();
    }

    public async onModuleDestroy(): Promise<void> {
        await this.client.close();
    }

    public async insert(document: TestsDoc): Promise<void> {
        await this.collection.insertOne(document);
    }

    public async clear(): Promise<void> {
        await this.collection.deleteMany();
    }

    public async count(): Promise<number> {
        const count = await this.collection.countDocuments();
        return count;
    }
}
