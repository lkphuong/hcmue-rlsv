import { Module } from '@nestjs/common';
import { controllers, modules, providers } from './app.imports';

@Module({
  imports: modules,
  controllers: controllers,
  providers: providers,
})
export class AppModule {}
