import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { FileEntity } from '../../../entities/file.entity';
import { LogService } from '../../../modules/log/services/log.service';

import { Levels } from '../../../constants/enums/level.enum';
import { Methods } from '../../../constants/enums/method.enum';
import { FileLogEntity } from '../../../entities/file_logs.entity';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly _fileRepository: Repository<FileEntity>,
    @InjectRepository(FileLogEntity)
    private readonly _fileLogRepository: Repository<FileLogEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

  async getFileLogsPagination(last_id?: number) {
    try {
      const conditions = this._fileLogRepository
        .createQueryBuilder('file_log')
        .where('file_log.status = :status', { status: 0 })
        .orderBy('file_log.created_at', 'DESC')
        .take(10);

      if (last_id) {
        conditions.andWhere('file_log.id < :last_id', { last_id });
      }

      const file_logs = await conditions.getMany();

      return file_logs || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'FilesService.getFileLogsPagination()',
        e,
      );
    }
  }

  async getFileById(id: number): Promise<FileEntity | null> {
    try {
      const conditions = this._fileRepository
        .createQueryBuilder('file')
        .where('file.id = :id', { id })
        .andWhere('file.deleted = :deleted', { deleted: false });

      const file = await conditions.getOne();
      return file || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'FilesService.getFileById()',
        e,
      );
      return null;
    }
  }

  async getFileByIds(ids: number[]): Promise<FileEntity[] | null> {
    try {
      const conditions = this._fileRepository
        .createQueryBuilder('file')
        .whereInIds(ids)
        .andWhere('file.deleted = :deleted', { deleted: false });

      const files = await conditions.getMany();
      return files || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'FilesService.getFileByIds()',
        e,
      );
      return null;
    }
  }

  async countFilesByItem(
    item_id: number,
    sheet_id: number,
    parent_ref: string,
  ): Promise<number> {
    try {
      const conditions = this._fileRepository
        .createQueryBuilder('file')
        .select('COUNT(file.id)', 'count')
        .where('file.sheet_id = :sheet_id', { sheet_id })
        .andWhere('file.item_id = :item_id', { item_id })
        .andWhere('file.parent_ref = :parent_ref', { parent_ref })
        .andWhere('file.deleted = :deleted', { deleted: false });

      const { count } = await conditions.getRawOne();

      return count || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'FilesService.countFilesByItem()',
        e,
      );
    }
  }

  async getFileByEvaluation(
    ref: string[],
    sheet_id: number[],
  ): Promise<FileEntity[] | null> {
    try {
      const conditions = this._fileRepository
        .createQueryBuilder('file')
        .where('file.parent_ref IN (:...ref)', { ref })
        .andWhere('file.sheet_id IN (:...sheet_id)', { sheet_id })
        .andWhere('file.deleted = :deleted', { deleted: false });

      const files = await conditions.getMany();

      return files || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'FilesService.getFileByEvaluation()',
        e,
      );
      return null;
    }
  }

  async add(
    originalName: string,
    filename: string,
    destination: string,
    url: string,
    extension: string,
    drafted: boolean,
    active: boolean,
    request_code: string,
    manager?: EntityManager,
  ): Promise<FileEntity | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      let file: FileEntity = new FileEntity();
      file.originalName = originalName;
      file.fileName = filename;
      file.path = destination;
      file.url = url;
      file.extension = extension;
      file.drafted = drafted;
      file.active = active;
      file.created_by = request_code;
      file.created_at = new Date();

      file = await manager.save(file);
      return file || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.INSERT,
        'FilesService.add()',
        e,
      );

      return null;
    }
  }

  async bulkUpdate(
    files: FileEntity[],
    manager?: EntityManager,
  ): Promise<FileEntity[] | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }
      await manager.save(FileEntity, files);

      return files || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.UPDATE,
        'FilesService.bulkUpdate()',
        e,
      );
      return null;
    }
  }

  async unlink(
    file_id: number,
    request_code: string,
    manager?: EntityManager,
  ): Promise<boolean | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const results = await manager.update(
        FileEntity,
        { id: file_id },
        { deleted_by: request_code, deleted_at: new Date(), deleted: true },
      );

      return results.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.DELETE,
        'FilesService.unlink()',
        e,
      );

      return null;
    }
  }

  async bulkUnlink(files: FileEntity[], manager?: EntityManager) {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }
      files = await manager.save(files);

      return files || null;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.DELETE,
        'FilesService.bulkUnlink()',
        e,
      );
      return null;
    }
  }

  async delete(sheet_id: number, manager?: EntityManager): Promise<boolean> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const result = await manager.delete(FileEntity, { sheet_id });

      return result.affected > 0;
    } catch (e) {
      this._logger.writeLog(
        Levels.ERROR,
        Methods.SELECT,
        'FilesService.delete()',
        e,
      );
      return null;
    }
  }
}
