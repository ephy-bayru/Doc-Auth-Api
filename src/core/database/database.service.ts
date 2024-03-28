import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { LoggerService } from 'src/common/services/logger.service';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @InjectConnection() private sequelize: Sequelize,
    private logger: LoggerService,
  ) {}

  async onModuleInit(): Promise<void> {
    try {
      await this.sequelize.authenticate();
      this.logger.log(
        'Connection to the database has been established successfully.',
      );
    } catch (error) {
      this.logger.error('Unable to connect to the database:', error);
    }
  }
}
