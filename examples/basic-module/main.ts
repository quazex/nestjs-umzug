import { MigrationFactory } from '../../source';
import { ExampleBasicModule } from './module';

const bootstrap = async(): Promise<void> => {
    await MigrationFactory.init(ExampleBasicModule);
};

bootstrap();
