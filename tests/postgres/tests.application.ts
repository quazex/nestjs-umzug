import { Test, TestingModule } from '@nestjs/testing';
import { KnexModule } from '@quazex/nestjs-knex';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { Umzug } from 'umzug';
import { UMZUG_PROVIDER_KEY, UmzugPostgresModule } from '../../source';
import { TestsMigration } from './tests.migration';
import { TestsRepository } from './tests.repository';

export class TestingApplication {
    private _testing: TestingModule;
    private _container: StartedPostgreSqlContainer;

    public async init(): Promise<void> {
        const tContainer = new PostgreSqlContainer('postgres:16.1');
        this._container = await tContainer.withReuse().start();

        const timeout = 10_000;
        const config = {
            connectionString: this._container.getConnectionUri(),
            statement_timeout: timeout,
            query_timeout: timeout,
            lock_timeout: timeout,
            idle_in_transaction_session_timeout: timeout,
            connectionTimeoutMillis: timeout,
        };

        const tModule = Test.createTestingModule({
            imports: [
                UmzugPostgresModule.forRoot({
                    connection: config,
                }),
                KnexModule.forRoot({
                    client: 'pg',
                    connection: config,
                }),
            ],
            providers: [
                TestsMigration,
                TestsRepository,
            ],
        });

        this._testing = await tModule.compile();
        this._testing = await this._testing.init();

        this._testing.enableShutdownHooks();
    }

    public async close(): Promise<void> {
        await this._testing.close();
        await this._container.stop();
    }

    public get repository(): TestsRepository {
        return this._testing.get(TestsRepository);
    }

    public get umzug(): Umzug {
        return this._testing.get<Umzug>(UMZUG_PROVIDER_KEY);
    }
}
