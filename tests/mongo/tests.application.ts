import { Test, TestingModule } from '@nestjs/testing';
import { MongoModule } from '@quazex/nestjs-mongodb';
import { MongoDBContainer, StartedMongoDBContainer } from '@testcontainers/mongodb';
import { MongoClientOptions } from 'mongodb';
import { Umzug } from 'umzug';
import { UMZUG_PROVIDER_KEY, UmzugMongoModule } from '../../source';
import { TestsMigration } from './tests.migration';
import { TestsRepository } from './tests.repository';

export class TestingApplication {
    private _testing: TestingModule;
    private _container: StartedMongoDBContainer;

    public async init(): Promise<void> {
        const tContainer = new MongoDBContainer('mongo:7.0.21');
        this._container = await tContainer.withReuse().start();

        const timeout = 10_000;
        const connection = this._container.getConnectionString();

        const config: MongoClientOptions = {
            directConnection: true,
            timeoutMS: timeout,
            socketTimeoutMS: timeout,
            connectTimeoutMS: timeout,
            serverSelectionTimeoutMS: timeout,
            autoSelectFamilyAttemptTimeout: timeout,
            maxIdleTimeMS: timeout,
        };

        const tModule = Test.createTestingModule({
            imports: [
                UmzugMongoModule.forRoot({
                    uri: connection,
                    options: config,
                }),
                MongoModule.forRoot({
                    url: connection,
                    ...config,
                }),
            ],
            providers: [
                TestsRepository,
                TestsMigration,
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
