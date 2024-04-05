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
  FindOptionsWhere,
  SelectQueryBuilder,
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

  async save(
    entityOrEntities: Partial<T> | Partial<T>[],
    options?: SaveOptions,
  ): Promise<T | T[]> {
    if (Array.isArray(entityOrEntities)) {
      // Perform the bulk insert without assigning the result to a variable
      await this.repository.insert(
        entityOrEntities as QueryDeepPartialEntity<T>[],
      );
      // If the entities are returned directly without modification, ensure they match the expected type
      // This may require ensuring the entities have all the necessary properties of `T`
      // If you cannot guarantee the entities fully match `T` at this point, you may need to fetch them from the database
      // after insertion or reconsider the method's return type and how it's used.
      return entityOrEntities as T[]; // Cast as T[], acknowledging potential type safety implications
    } else {
      // For a single entity, return it directly after save, assuming it now fully conforms to T
      return this.repository.save(entityOrEntities as any, options);
    }
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

  async search(
    criteria: any,
    options: FindManyOptions<T> = {},
    page: number = 1,
    limit: number = 10,
    sort?: { field: string; order: 'ASC' | 'DESC' },
  ): Promise<{ data: T[]; total: number; page: number; limit: number }> {
    const queryBuilder = this.repository.createQueryBuilder('entity');

    // Handle complex criteria
    this.applyCriteria(queryBuilder, criteria);

    // Apply options to the query
    this.applyOptions(queryBuilder, options);

    // Sorting
    if (sort) {
      queryBuilder.orderBy(`entity.${sort.field}`, sort.order);
    }

    // Pagination
    const [data, total] = await queryBuilder
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total, page, limit };
  }

  private applyCriteria(queryBuilder: SelectQueryBuilder<T>, criteria: any) {
    Object.entries(criteria).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        Object.entries(value).forEach(([operator, opValue]) => {
          const parameterKey = `${key}_${operator}`;
          let queryPart;
          switch (operator) {
            case 'gt':
              queryPart = `entity.${key} > :${parameterKey}`;
              break;
            case 'lt':
              queryPart = `entity.${key} < :${parameterKey}`;
              break;
            case 'like':
              queryPart = `entity.${key} LIKE :${parameterKey}`;
              opValue = `%${opValue}%`;
              break;
            case 'in':
              queryPart = `entity.${key} IN (:...${parameterKey})`;
              break;
            default:
              queryPart = `entity.${key} = :${parameterKey}`; // Fallback to equality
          }
          queryBuilder.andWhere(queryPart, { [String(parameterKey)]: opValue });
        });
      } else {
        // Direct equality
        queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
      }
    });
  }

  private applyOptions(
    queryBuilder: SelectQueryBuilder<T>,
    options: FindManyOptions<T>,
  ) {
    // Handle relations
    if (Array.isArray(options.relations)) {
      options.relations.forEach((relation) => {
        queryBuilder.leftJoinAndSelect(`entity.${relation}`, relation);
      });
    } else if (typeof options.relations === 'object') {
      // If relations are specified in an object format
      Object.keys(options.relations).forEach((relationKey) => {
        queryBuilder.leftJoinAndSelect(`entity.${relationKey}`, relationKey);
      });
    }

    // Apply custom selections if provided
    // Apply custom selections if provided
    if (Array.isArray(options.select)) {
      queryBuilder.select(
        options.select.map((field) => `entity.${String(field)}`),
      );
    }

    // Additional where conditions
    if (options.where) {
      Object.entries(options.where).forEach(([key, value]) => {
        if (typeof value === 'object' && value !== null) {
          // This reuses the logic from applyCriteria for complex conditions
          Object.entries(value).forEach(([operator, opValue]) => {
            const parameterKey = `where_${key}_${operator}`;
            let queryPart;
            switch (operator) {
              // Add cases as needed, following the applyCriteria structure
              default:
                queryPart = `entity.${key} = :${parameterKey}`;
            }
            queryBuilder.andWhere(queryPart, { [parameterKey]: opValue });
          });
        } else {
          queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
        }
      });
    }

    // Ordering
    if (options.order) {
      Object.entries(options.order).forEach(([key, value]) => {
        queryBuilder.addOrderBy(`entity.${key}`, value as 'ASC' | 'DESC');
      });
    }
  }
}
