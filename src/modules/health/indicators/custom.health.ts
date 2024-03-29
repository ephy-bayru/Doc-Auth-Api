import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';

@Injectable()
export class CustomHealthIndicator extends HealthIndicator {
  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const isHealthy = this.checkCustomService();
    const result = this.getStatus(key, isHealthy);

    if (!isHealthy) {
      throw new HealthCheckError('Custom service check failed', result);
    }
    return result;
  }

  private checkCustomService(): boolean {
    return true;
  }
}
