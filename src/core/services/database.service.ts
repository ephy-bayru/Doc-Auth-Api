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
    await this.checkDatabaseConnection();
  }

  private async checkDatabaseConnection(): Promise<void> {
    const retryAttempts = 3;
    let attempt = 0;

    while (attempt < retryAttempts) {
      try {
        await this.entityManager.query('SELECT 1');
        this.logger.log(
          'Connection to the database has been established successfully.',
        );
        return;
      } catch (error) {
        this.logger.error(
          `Unable to connect to the database on attempt ${attempt + 1}:`,
          error,
        );
        if (attempt < retryAttempts - 1) {
          this.logger.log('Retrying database connection...');
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
      attempt++;
    }

    throw new Error(
      'Failed to connect to the database after several attempts.',
    );
  }
}
