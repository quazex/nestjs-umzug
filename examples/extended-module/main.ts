import { MigrationFactory } from '../../source';
import { ExampleExtendedModule } from './module';

const bootstrap = async(): Promise<void> => {
    await MigrationFactory.init(ExampleExtendedModule);
};

bootstrap();
