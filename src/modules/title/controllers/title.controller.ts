import { Controller } from '@nestjs/common';
import { LogService } from '../../../modules/log/services/log.service';

import { TitleService } from '../services/title.service';
@Controller('titles')
export class TitleController {
  constructor(
    private readonly _titleService: TitleService,
    private _logger: LogService,
  ) {
    // Due to transient scope, HeaderController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(TitleController.name);
  }
}
