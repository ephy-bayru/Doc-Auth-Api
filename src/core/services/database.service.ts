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
    try {
      await this.retryConnection();
    } catch (error) {
      this.logger.error(
        'Database Connection',
        'Failed to establish database connection after retries',
        JSON.stringify({ error: error.message }),
      );
      throw new Error(
        `Failed to connect to the database after retries: ${error.message}`,
      );
    }
  }

  private async retryConnection(): Promise<void> {
    const retryAttempts = 3;
    for (let attempt = 0; attempt < retryAttempts; attempt++) {
      try {
        await this.entityManager.query('SELECT 1'); // Check database connection with a simple query
        this.logger.log(
          'Database Connection',
          'Connection to the database has been established successfully.',
          { attempt: attempt + 1, status: 'success' },
        );
        return; // Exit the function after successful connection
      } catch (error) {
        this.logger.error(
          'Database Connection',
          `Unable to connect to the database on attempt ${
            attempt + 1
          }. Error: ${error.message}`,
          JSON.stringify({
            attempt: attempt + 1,
            error: error.toString(),
            status: 'failed',
          }),
        );
        if (attempt < retryAttempts - 1) {
          this.logger.log(
            'Database Connection',
            'Retrying database connection...',
            { attempt: attempt + 1, status: 'retrying' },
          );
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds before retrying
        }
      }
    }
    throw new Error(
      'Failed to connect to the database after several attempts.',
    );
  }
}
