import { Controller } from '@nestjs/common';
import { LogService } from '../../../modules/log/services/log.service';

import { HeaderService } from '../services/header.service';

@Controller('headers')
export class HeaderController {
  constructor(
    private readonly _headerService: HeaderService,
    private _logger: LogService,
  ) {
    // Due to transient scope, HeaderController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(HeaderController.name);
  }
}
