import { Module } from '@nestjs/common';
import { controllers, exporteds, modules, providers } from './status.imports';

@Module({
  imports: modules,
  controllers: controllers,
  providers: providers,
  exports: exporteds,
})
export class StatusModule {}
