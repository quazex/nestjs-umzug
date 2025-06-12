import { faker } from '@faker-js/faker';
import { ObjectId } from 'mongodb';
import { Migration, MigrationHandler } from '../../source';
import { TestsRepository } from './tests.repository';

@Migration({
    order: 1,
})
export class TestsMigration implements MigrationHandler {
    constructor(private readonly repository: TestsRepository) {}

    public async up(): Promise<void> {
        await this.repository.insert({
            _id: new ObjectId(),
            name: faker.person.fullName().toLowerCase(),
            count: faker.number.int({ min: 0, max: 10 }),
            timestamp: new Date(),
        });
    }

    public async down(): Promise<void> {
        await this.repository.clear();
    }
}
