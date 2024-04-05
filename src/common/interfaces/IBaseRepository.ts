import {
  FindOneOptions,
  FindManyOptions,
  SaveOptions,
  UpdateResult,
  DeleteResult,
  FindOptionsWhere,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

/**
 * Represents a base repository interface for CRUD operations on entities.
 *
 * @typeparam T - The type of the entity.
 */
export interface IBaseRepository<T> {
  /**
   * Finds an entity by its id or with additional options.
   *
   * @param id - The id of the entity or additional options for finding.
   * @returns A promise resolving to the found entity or null if not found.
   */
  findOne(id: number | FindOneOptions<T>): Promise<T | null>;

  /**
   * Finds all entities with optional find options.
   *
   * @param options - Additional options for finding entities.
   * @returns A promise resolving to an array of found entities.
   */
  findAll(options?: FindManyOptions<T>): Promise<T[]>;

  /**
   * Saves a single entity or multiple entities.
   * If a single entity is provided, it returns the saved entity.
   * If an array of entities is provided, it returns an array of the saved entities.
   * The method can optionally accept save options.
   *
   * @param entityOrEntities - The entity or array of entities to save.
   * @param options - Optional save options to customize the save operation.
   * @returns The saved entity or entities as a promise.
   */
  save(
    entityOrEntities: Partial<T> | Partial<T>[],
    options?: SaveOptions,
  ): Promise<T | T[]>;

  /**
   * Updates an entity or multiple entities.
   *
   * @param criteria - The id or find options for updating entities.
   * @param partialEntity - The partial entity with updated values.
   * @returns A promise resolving to the update result.
   */
  update(
    criteria: number | FindOptionsWhere<T>,
    partialEntity: Partial<T>,
  ): Promise<UpdateResult>;

  /**
   * Updates multiple entities.
   *
   * @param criteria - The find options for updating entities.
   * @param partialEntity - The partial entity with updated values.
   * @returns A promise resolving to the update result.
   */
  updateMany(
    criteria: FindOptionsWhere<T>,
    partialEntity: QueryDeepPartialEntity<T>,
  ): Promise<UpdateResult>;

  /**
   * Deletes an entity or multiple entities.
   *
   * @param criteria - The id or find options for deleting entities.
   * @returns A promise resolving to the delete result.
   */
  delete(criteria: number | FindOptionsWhere<T>): Promise<DeleteResult>;

  /**
   * Deletes multiple entities.
   *
   * @param criteria - The find options for deleting entities.
   * @returns A promise resolving to the delete result.
   */
  deleteMany(criteria: FindOptionsWhere<T>): Promise<DeleteResult>;

  /**
   * Counts the number of entities with optional find options.
   *
   * @param options - Additional options for counting entities.
   * @returns A promise resolving to the count of entities.
   */
  count(options?: FindManyOptions<T>): Promise<number>;

  /**
   * Checks if an entity exists with the given find options.
   *
   * @param criteria - The find options for checking entity existence.
   * @returns A promise resolving to true if the entity exists, false otherwise.
   */
  exists(criteria: FindOptionsWhere<T>): Promise<boolean>;

  /**
   * Retrieves paginated data based on the given options.
   *
   * @param options - Additional options for paginating entities.
   * @param page - The page number for pagination.
   * @param limit - The maximum number of entities per page.
   * @returns A promise resolving to an object containing paginated data and metadata.
   */
  paginate(
    options?: FindManyOptions<T>,
    page?: number,
    limit?: number,
  ): Promise<{ data: T[]; total: number; page: number; limit: number }>;

  // search method does not need a TSDoc comment
  search(
    criteria: any,
    options?: FindManyOptions<T>,
    page?: number,
    limit?: number,
    sort?: { field: string; order: 'ASC' | 'DESC' },
  ): Promise<{ data: T[]; total: number; page: number; limit: number }>;
}
