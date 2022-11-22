import { Controller } from '@nestjs/common';
import { LogService } from '../../../modules/log/services/log.service';

import { ItemService } from '../services/item.service';

@Controller('items')
export class ItemController {
  constructor(
    private readonly _itemService: ItemService,
    private _logger: LogService,
  ) {
    // Due to transient scope, HeaderController has its own unique instance of LogService,
    // so setting context here will not affect other instances in other services
    this._logger.setContext(ItemController.name);
  }
}
