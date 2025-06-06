import { CommandError } from '@errors/command.error';
import { Inject, Logger } from '@nestjs/common';
import { Command, CommandRunner } from 'nest-commander';
import { Umzug } from 'umzug';
import { MigrationsTemplate } from './migrations.template';
import { UMZUG_PROVIDER_KEY } from './migrations.tokens';

@Command({ name: 'migrate', description: 'Run migrations' })
export class MigrationsCommands extends CommandRunner {
    private readonly logger = new Logger('Migrations');

    constructor(@Inject(UMZUG_PROVIDER_KEY) private readonly service: Umzug) {
        super();
    }

    public async run(params: string[]): Promise<void> {
        const [command, ...args] = params;

        if (command === 'up') {
            const meta = await this.service.up();
            this.logger.log(`Successfully up ${meta.length} migrations`);
            return;
        }

        if (command === 'down' && args.length > 0) {
            const meta = await this.service.down({
                migrations: args,
            });
            this.logger.log(`Successfully down ${meta.length} migrations`);
            return;
        }

        if (command === 'generate') {
            const filename = args.at(0) ?? 'migration';
            const timestamp = Date.now();

            await this.service.create({
                name: `${timestamp}.${filename}.ts`,
                prefix: 'NONE',
                allowExtension: '.ts',
                allowConfusingOrdering: false,
                skipVerify: true,
                content: await MigrationsTemplate.generate(timestamp),
            });
            return;
        }

        throw new CommandError('There is no command to run');
    }
}
