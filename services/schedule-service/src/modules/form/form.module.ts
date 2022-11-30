import { Module } from '@nestjs/common';
import { exporteds, modules, providers } from './form.imports';

@Module({
  imports: modules,
  providers: providers,
  exports: exporteds,
})
export class FormModule {}
