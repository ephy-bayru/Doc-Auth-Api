import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { serialize, deserialize } from '../utils/serialization-utils';
import { LoggerService } from './logger.service';

@Injectable()
export class CacheService {
  private defaultTtl = 300;

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private logger: LoggerService,
  ) {}

  async set(
    key: string,
    value: any,
    ttl: number = this.defaultTtl,
  ): Promise<void> {
    try {
      const serializedValue = serialize(value);
      await this.cacheManager.set(key, serializedValue, ttl);
      this.logger.logInfo(`Cache set for key ${key}`);
    } catch (error) {
      this.logger.logError(`Error setting cache for key ${key}: ${error}`);
      throw error;
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const value = await this.cacheManager.get<string>(key);
      if (value) {
        this.logger.logInfo(`Cache hit for key ${key}`);
        return deserialize<T>(value);
      } else {
        this.logger.logDebug(`Cache miss for key ${key}`);
      }
    } catch (error) {
      this.logger.logError(`Error getting cache for key ${key}: ${error}`);
    }
    return null;
  }

  async del(key: string): Promise<void> {
    try {
      await this.cacheManager.del(key);
      this.logger.logInfo(`Cache deleted for key ${key}`);
    } catch (error) {
      this.logger.logError(`Error deleting cache for key ${key}: ${error}`);
      throw error;
    }
  }

  async getOrSet<T>(
    key: string,
    fetchFunction: () => Promise<T>,
    ttl: number = this.defaultTtl,
  ): Promise<T> {
    let value: T | null = null;
    try {
      value = await this.get<T>(key);
      if (!value) {
        value = await fetchFunction();
        await this.set(key, value, ttl);
        this.logger.logInfo(`Cache set for key ${key} after fetch`);
      }
    } catch (error) {
      this.logger.logError(`Error in getOrSet for key ${key}: ${error}`);
      // In case of an error, still try to fetch the value
      if (!value) value = await fetchFunction();
    }
    return value;
  }
}
