import { Module } from '@nestjs/common';
import { controllers, exporteds, modules, providers } from './major.imports';

@Module({
  imports: modules,
  controllers: controllers,
  providers: providers,
  exports: exporteds,
})
export class MajorModule {}
