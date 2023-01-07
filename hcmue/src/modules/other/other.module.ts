import { Module } from '@nestjs/common';
import { controllers, exporteds, modules, providers } from './other.imports';

@Module({
  imports: modules,
  controllers: controllers,
  providers: providers,
  exports: exporteds,
})
export class OtherModule {}
