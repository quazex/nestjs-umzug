import { Inject, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import { MONGO_CLIENT } from './mongo.tokens';

@Module({})
export class MongoBootstrap implements OnModuleInit, OnModuleDestroy {
    constructor(
        @Inject(MONGO_CLIENT) private readonly client: MongoClient,
    ) {}

    public async onModuleInit(): Promise<void> {
        await this.client.connect();
    }

    public async onModuleDestroy(): Promise<void> {
        await this.client.close();
    }
}
