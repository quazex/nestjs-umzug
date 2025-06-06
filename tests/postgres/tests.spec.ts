import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import { TestingApplication } from './tests.application';

describe('Umzug Postgres', () => {
    const testingApp = new TestingApplication();

    beforeAll(testingApp.init.bind(testingApp));
    afterAll(testingApp.close.bind(testingApp));

    test('Should success', async() => {
        await testingApp.umzug.up();
        const count = await testingApp.repository.count();
        expect(count).toBeGreaterThan(0);
    });
});
