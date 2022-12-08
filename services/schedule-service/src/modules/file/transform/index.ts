import * as path from 'path';

import { FileEntity } from '../../../entities/file.entity';

import { ConfigurationService } from '../../shared/services/configuration/configuration.service';

import { Configuration } from '../../shared/constants/configuration.enum';

import { FileResponse } from '../interfaces/get-file-response.interface';

export const generateData2Array = (
  documents: FileEntity[] | null,
  configuration_service: ConfigurationService,
) => {
  if (documents) {
    const root = configuration_service.get(Configuration.MULTER_DEST);

    const payload: FileResponse[] = [];
    for (const document of documents) {
      const item: FileResponse = {
        id: document.id,
        original_name: document.originalName,
        path: path.join(root, document.fileName),
      };

      payload.push(item);
    }

    return payload;
  }

  return null;
};
