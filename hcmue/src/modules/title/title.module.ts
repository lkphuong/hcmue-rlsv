import { Module } from '@nestjs/common';

import { controllers, exporteds, modules, providers } from './title.imports';

@Module({
  imports: modules,
  controllers: controllers,
  providers: providers,
  exports: exporteds,
})
export class TitleModule {}
