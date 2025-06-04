import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectKnex } from '@quazex/nestjs-knex';
import { Knex } from 'knex';
import { BasicDoc } from './types';

@Injectable()
export class ExampleBasicRepository implements OnModuleInit, OnModuleDestroy {
    private readonly table = 'basic_table';

    constructor(@InjectKnex() private readonly client: Knex) {}

    public async onModuleInit(): Promise<void> {
        await this.client.schema.createTable(this.table, (table) => {
            table.uuid('id');
            table.text('name');
            table.integer('count');
            table.integer('timestamp');
        });
    }

    public async onModuleDestroy(): Promise<void> {
        await this.client.destroy();
    }

    public async insert(document: BasicDoc): Promise<void> {
        await this.client(this.table).insert(document);
    }

    public async clear(): Promise<void> {
        await this.client(this.table).delete();
    }
}
