import {
  ConflictException,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { Worksheet } from '../entities/worksheet.entity';
import { DataSource } from 'typeorm';
import { CreateWorksheetsDto } from '../dto/create-worksheets.dto';

@Injectable()
export class WorksheetCreateManyProvider {
  constructor(
    // inject datasource
    private readonly datasource: DataSource,
  ) {}

  public async createWorksheets(createWorksheetsDto: CreateWorksheetsDto) {
    const newWorksheets: Worksheet[] = [];
    // create query runner instance
    const queryRunner = this.datasource.createQueryRunner();

    try {
      // connect query runner instance to datasource
      await queryRunner.connect();
      //start transaction
      await queryRunner.startTransaction();
    } catch {
      throw new RequestTimeoutException('Could not connect to the database.');
    }
    try {
      for (const worksheet of createWorksheetsDto.worksheets) {
        const newWorksheet = queryRunner.manager.create(Worksheet, worksheet);
        const result = await queryRunner.manager.save(newWorksheet);
        newWorksheets.push(result);
      }

      // if sucessfull, commit
      await queryRunner.commitTransaction();
    } catch (error) {
      // if unsuccessfull, rollback
      await queryRunner.rollbackTransaction();
      throw new ConflictException('Could not complete the transaction', {
        description: String(error),
      });
    } finally {
      // release the connection
      await queryRunner.release();
    }
    return newWorksheets;
  }
}
