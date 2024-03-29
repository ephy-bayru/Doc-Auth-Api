import {
  FindOneOptions,
  FindManyOptions,
  SaveOptions,
  UpdateResult,
  DeleteResult,
  InsertResult,
  FindOptionsWhere,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface IBaseRepository<T> {
  findOne(id: number | FindOneOptions<T>): Promise<T | null>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  create(
    entity: Partial<T> | Partial<T>[],
    options?: SaveOptions,
  ): Promise<T | T[]>;
  createMany(entities: Partial<T>[]): Promise<InsertResult>;
  update(
    criteria: number | FindOptionsWhere<T>,
    partialEntity: Partial<T>,
  ): Promise<UpdateResult>;
  updateMany(
    criteria: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult>;
  delete(criteria: number | FindOptionsWhere<T>): Promise<DeleteResult>;
  deleteMany(criteria: FindOptionsWhere<T>): Promise<DeleteResult>;
  count(options?: FindManyOptions<T>): Promise<number>;
  exists(criteria: FindOptionsWhere<T>): Promise<boolean>;
  paginate(
    options?: FindManyOptions<T>,
    page?: number,
    limit?: number,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }>;
  search(criteria: any, options?: FindManyOptions<T>): Promise<T[]>;
}
