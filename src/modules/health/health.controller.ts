import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CustomHealthIndicator } from './indicators/custom.health';
import { ConfigService } from '@nestjs/config';
// import { JwtAuthGuard } from 'path/to/jwt-auth.guard';

@ApiTags('Health')
@Controller({ path: 'health', version: '1' })
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private http: HttpHealthIndicator,
    private customIndicator: CustomHealthIndicator,
    private configService: ConfigService,
  ) {}

  @Get()
  // @UseGuards(JwtAuthGuard)
  @HealthCheck()
  @ApiOperation({ summary: 'Check application health' })
  @ApiResponse({ status: 200, description: 'Health check passed' })
  @ApiResponse({ status: 503, description: 'Health check failed' })
  check() {
    return this.health
      .check([
        () =>
          this.db.pingCheck('database', {
            timeout: this.configService.get<number>('DB_HEALTH_TIMEOUT', 5000),
          }),
        () =>
          this.http.pingCheck(
            'externalService',
            this.configService.get<string>(
              'EXTERNAL_SERVICE_URL',
              'https://ephrembayru.com/',
            ),
          ),
        () => this.customIndicator.isHealthy('customService'),
      ])
      .catch((error) => {
        throw new HttpException(
          {
            status: HttpStatus.SERVICE_UNAVAILABLE,
            error: 'One or more health checks failed',
            details: error.response,
          },
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      });
  }
}
