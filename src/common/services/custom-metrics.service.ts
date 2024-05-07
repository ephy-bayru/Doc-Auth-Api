import { Injectable } from '@nestjs/common';
import { Counter, Histogram, register } from 'prom-client';

@Injectable()
export class CustomMetricsService {
  private readonly httpRequestDuration: Histogram<string>;
  private readonly httpRequestCounter: Counter<string>;

  constructor() {
    // Histogram to measure request durations
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code'],
      buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.5, 1, 2.5, 5, 10],
    });

    // Counter to measure request counts
    this.httpRequestCounter = new Counter({
      name: 'http_request_count',
      help: 'Counter for total HTTP requests',
      labelNames: ['method', 'route', 'status_code'],
    });
  }

  recordRequest(
    method: string,
    route: string,
    statusCode: number,
    duration: number,
  ) {
    this.httpRequestDuration
      .labels(method, route, statusCode.toString())
      .observe(duration);
    this.httpRequestCounter.labels(method, route, statusCode.toString()).inc();
  }

  async getMetricsAsPrometheusFormat() {
    return await register.metrics();
  }
}
