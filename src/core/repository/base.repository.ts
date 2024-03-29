import { IBaseRepository } from 'src/common/interfaces/IBaseRepository';
import {
  DataSource,
  EntityTarget,
  FindManyOptions,
  FindOneOptions,
  Repository,
  SaveOptions,
  UpdateResult,
  DeleteResult,
  InsertResult,
  FindOptionsWhere,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export class BaseRepository<T> implements IBaseRepository<T> {
  private repository: Repository<T>;

  constructor(
    private dataSource: DataSource,
    private entity: EntityTarget<T>,
  ) {
    this.repository = this.dataSource.getRepository(this.entity);
  }

  async findOne(idOrOptions: number | FindOneOptions<T>): Promise<T | null> {
    if (typeof idOrOptions === 'number') {
      const findOptions: FindOptionsWhere<T> = {} as FindOptionsWhere<T>;
      findOptions['id'] = idOrOptions;
      return this.repository.findOne({
        where: findOptions,
      });
    }
    return this.repository.findOne(idOrOptions);
  }

  async findAll(options: FindManyOptions<T> = {}): Promise<T[]> {
    return this.repository.find(options);
  }

  async create(entity: Partial<T>, options?: SaveOptions): Promise<T> {
    return this.repository.save(entity as any, options);
  }

  async createMany(entities: Partial<T>[]): Promise<InsertResult> {
    const transformedEntities: QueryDeepPartialEntity<T>[] =
      entities as unknown as QueryDeepPartialEntity<T>[];
    return this.repository.insert(transformedEntities);
  }

  async update(
    criteria: number | FindOptionsWhere<T>,
    partialEntity: Partial<T>,
  ): Promise<UpdateResult> {
    const transformedEntity: QueryDeepPartialEntity<T> =
      partialEntity as QueryDeepPartialEntity<T>;

    if (typeof criteria === 'number') {
      return this.repository.update(criteria, transformedEntity);
    }
    return this.repository.update(criteria, transformedEntity);
  }

  async updateMany(
    criteria: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult> {
    return this.repository.update(criteria, partialEntity);
  }

  async delete(criteria: number | FindOptionsWhere<T>): Promise<DeleteResult> {
    if (typeof criteria === 'number') {
      return this.repository.delete(criteria);
    }
    return this.repository.delete(criteria);
  }

  async deleteMany(criteria: FindOptionsWhere<T>): Promise<DeleteResult> {
    return await this.repository.delete(criteria);
  }

  async count(options: FindManyOptions<T> = {}): Promise<number> {
    return this.repository.count(options);
  }

  async exists(criteria: FindOneOptions<T>): Promise<boolean> {
    const count = await this.repository.count(criteria);
    return count > 0;
  }

  async paginate(
    options: FindManyOptions<T> = {},
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const [data, total] = await this.repository.findAndCount({
      ...options,
      take: limit,
      skip: (page - 1) * limit,
    });
    return { data, total, page, limit };
  }

  async search(criteria: any, options: FindManyOptions<T> = {}): Promise<T[]> {
    return await this.repository.find({ ...options, where: criteria });
  }
}
