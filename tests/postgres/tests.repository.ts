import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectKnex } from '@quazex/nestjs-knex';
import { Knex } from 'knex';
import { TestsDoc } from './tests.types';

@Injectable()
export class TestsRepository implements OnModuleInit, OnModuleDestroy {
    private readonly table = 'test_table';

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

    public async insert(document: TestsDoc): Promise<void> {
        await this.client(this.table).insert(document);
    }

    public async clear(): Promise<void> {
        await this.client(this.table).delete();
    }

    public async count(): Promise<number> {
        const rows = await this.client(this.table).count({ count: '*' });

        const first = rows.at(0)?.count;
        if (typeof first === 'number') {
            return first;
        }

        if (typeof first === 'string') {
            const int = Number.parseInt(first);
            if (int > 0) {
                return int;
            }
        }

        return 0;
    }
}
