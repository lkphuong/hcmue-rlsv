import { HttpException } from '@nestjs/common';
import { Request } from 'express';
import * as multer from 'multer';

import {
  validateFileExtension,
  validateFileName,
  validateFileSize,
} from './validations';

import { Configuration } from '../modules/shared/constants/configuration.enum';
import { ConfigurationService } from '../modules/shared/services/configuration/configuration.service';
import { writeFileLog } from '../modules/file/funcs';
import { JwtPayload } from '../modules/auth/interfaces/payloads/jwt-payload.interface';

export const multerFactory = async (
  configurationService: ConfigurationService,
) => ({
  dest: configurationService.get(Configuration.MULTER_DEST),
  storage: multer.diskStorage({
    destination(req, file, callback) {
      callback(null, configurationService.get(Configuration.MULTER_DEST));
    },
    filename(req, file, callback) {
      callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    },
  }),
  limits: {
    fieldSize: configurationService.get(
      Configuration.MAX_FIELD_SIZE_VALUE,
    ) as unknown as number,
  },
  fileFilter: async (req: Request, file, cb) => {
    const { username } = req.user as JwtPayload;

    let valid = await validateFileExtension(configurationService, file, req);
    if (valid instanceof HttpException) {
      await writeFileLog(
        username,
        `Upload fail file ${file?.originalname} error: ${valid.message}`,
        0,
        JSON.stringify(file),
      );
      return cb(valid, false);
    }

    valid = await validateFileSize(configurationService, file, req);
    if (valid instanceof HttpException) {
      await writeFileLog(
        username,
        `Upload fail file ${file?.originalname} error: ${valid.message}`,
        0,
        JSON.stringify(file),
      );
      return cb(valid, false);
    }

    valid = await validateFileName(file, req);
    if (valid instanceof HttpException) {
      await writeFileLog(
        username,
        `Upload fail file ${file?.originalname} error: ${valid.message}`,
        0,
        JSON.stringify(file),
      );
      return cb(valid, false);
    }
    cb(null, true);
  },
});
