import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { count } from 'console';
import { Levels } from 'src/constants/enums/level.enum';
import { Methods } from 'src/constants/enums/method.enum';
import { FileEntity } from 'src/entities/file.entity';
import { LogService } from 'src/modules/log/services/log.service';
import { DataSource, EntityManager, Repository } from 'typeorm';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(FileEntity)
    private readonly _fileRepository: Repository<FileEntity>,
    private readonly _dataSource: DataSource,
    private _logger: LogService,
  ) {}

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
    ref: string,
    sheet_id: number,
  ): Promise<FileEntity[] | null> {
    try {
      const conditions = this._fileRepository
        .createQueryBuilder('file')
        .where('file.parent_ref = :ref', { ref })
        .andWhere('file.sheet_id = :sheet_id', { sheet_id })
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
    user_id: string,
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
      file.created_by = user_id;
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
      if (manager) {
        manager = this._dataSource.manager;
      }
      files = await manager.save(files);

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
    user_id: string,
    manager?: EntityManager,
  ): Promise<boolean | null> {
    try {
      if (!manager) {
        manager = this._dataSource.manager;
      }

      const results = await manager.update(
        FileEntity,
        { id: file_id },
        { deleted_by: user_id, deleted_at: new Date(), deleted: true },
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
}
