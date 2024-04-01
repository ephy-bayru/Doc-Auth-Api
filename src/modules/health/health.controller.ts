import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CustomHealthIndicator } from './indicators/custom.health';
import { HealthCheckDocs } from './documentation/health.controller.documentation';
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
  @HealthCheckDocs()
  @ApiOperation({ summary: 'Check application health' })
  check() {
    return this.health.check([
      () =>
        this.db.pingCheck('database', {
          timeout: this.configService.get<number>('DB_HEALTH_TIMEOUT', 3000),
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
    ]);
  }
}
