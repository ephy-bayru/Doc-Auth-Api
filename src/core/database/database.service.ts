import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { LoggerService } from 'src/common/services/logger.service';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @InjectEntityManager() private entityManager: EntityManager,
    private logger: LoggerService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.entityManager.query('SELECT 1');
      this.logger.log(
        'Connection to the database has been established successfully.',
      );
    } catch (error) {
      this.logger.error('Unable to connect to the database:', error);
    }
  }
}
