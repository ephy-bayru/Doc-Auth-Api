import { Injectable, Logger } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';

@Injectable()
export class CustomHealthIndicator extends HealthIndicator {
  private readonly logger = new Logger(CustomHealthIndicator.name);

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      const isHealthy = await this.checkCustomService();
      const result = this.getStatus(key, isHealthy, {
        message: 'Custom service is responsive.',
      });

      if (!isHealthy) {
        throw new HealthCheckError('Custom service check failed', result);
      }

      return result;
    } catch (error) {
      this.logger.error(`Health check for ${key} failed: ${error.message}`);
      const result = this.getStatus(key, false, {
        message: `Error: ${error.message}`,
      });
      throw new HealthCheckError('Custom service check exception', result);
    }
  }

  private async checkCustomService(): Promise<boolean> {
    const responseTime = Math.random() * 1000;
    this.logger.log(
      `Custom service response time: ${responseTime.toFixed(2)}ms`,
    );

    return responseTime <= 800;
  }
}
