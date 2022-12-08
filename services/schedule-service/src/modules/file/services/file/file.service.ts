import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, DataSource, Repository } from 'typeorm';

import { FileEntity } from '../../../../entities/file.entity';

import { Levels } from '../../../../constants/enums/level.enum';
import { Methods } from '../../../../constants/enums/method.enum';

import { LogService } from '../../../log/services/log.service';

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly _fileRepository: Repository<FileEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}
  async getDraftedFiles(): Promise<FileEntity[] | null> {
    try {
      const conditions = this._fileRepository
        .createQueryBuilder('file')
        .where('CAST(file.created_at AS DATE) < CAST(CURDATE() AS DATE)')
        .andWhere('file.drafted = :drafted', { drafted: true })
        .andWhere('file.deleted = :deleted', { deleted: false });

      const files = await conditions.getMany();

      return files || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'FileService.getDraftedFiles()',
        e,
      );
      return null;
    }
  }

  async bulkUnlink(manager?: EntityManager): Promise<boolean> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const conditions = await this._dataSource
        .createQueryBuilder()
        .update(FileEntity)
        .set({ deleted: true, deleted_by: 'system', deleted_at: new Date() })
        .where('deleted = :deleted', { deleted: false })
        .andWhere('drafted = :drafted', { drafted: true })
        .andWhere('CAST(created_at AS DATE) < CAST(CURDATE() AS DATE)');

      const result = await conditions.execute();

      return result.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.DELETE,
        'FileService.bulkUnlink()',
        e,
      );
      return null;
    }
  }
}
