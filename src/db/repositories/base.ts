import type { Container, PartitionKey, PatchRequestBody, SqlQuerySpec } from '@azure/cosmos';
import { CosmosQueryBuilder } from '@heivo/cosmonaut';
import { CosmosDB } from '@/db/db_manager';

export class BaseRepository<T> extends CosmosDB {
  protected _client_db: Container;
  protected _customer_db: Container;
  protected _query_builder = new CosmosQueryBuilder<T>();

  constructor(clientDB: 'client-db', customerDB: 'customer-db') {
    super();
    this._client_db = CosmosDB.getContainer(clientDB);
    this._customer_db = CosmosDB.getContainer(customerDB);
  }

  private getAndUseContainer(db: 'client-db' | 'customer-db'): Container {
    return db === 'client-db' ? this._client_db : this._customer_db;
  }

  private async queryItems(querySpec: SqlQuerySpec, db: 'client-db' | 'customer-db'): Promise<Array<T>> {
    const container = this.getAndUseContainer(db);
    const { resources } = await container.items.query<T>(querySpec).fetchAll();
    return resources;
  }

  protected async create(item: T, db: 'client-db' | 'customer-db'): Promise<T | null> {
    const container = this.getAndUseContainer(db);
    const { resource } = await container.items.create<T>(item);
    return resource || null;
  }

  protected async upsert(item: T, db: 'client-db' | 'customer-db'): Promise<T | null> {
    const container = this.getAndUseContainer(db);
    const { resource } = await container.items.upsert<T>(item);
    return resource || null;
  }

  protected async update(
    id: string,
    item: T,
    db: 'client-db' | 'customer-db',
    partitionKeyValue?: PartitionKey,
  ): Promise<T | null> {
    const container = this.getAndUseContainer(db);
    const { resource } = await container.item(id, partitionKeyValue).replace<T>(item);
    return resource || null;
  }

  protected async patch(
    id: string,
    patchList: PatchRequestBody,
    db: 'client-db' | 'customer-db',
    partitionKeyValue?: PartitionKey,
  ): Promise<T | null> {
    const container = this.getAndUseContainer(db);
    const { resource } = await container.item(id, partitionKeyValue).patch(patchList);
    return resource || null;
  }

  protected async delete(
    id: string,
    db: 'client-db' | 'customer-db',
    partitionKeyValue?: PartitionKey,
  ): Promise<T | void> {
    const container = this.getAndUseContainer(db);
    const { resource } = await container.item(id, partitionKeyValue).delete<T>();
    return resource;
  }

  protected async fetchById(id: string, db: 'client-db' | 'customer-db'): Promise<T | null> {
    const container = this.getAndUseContainer(db);
    const { resource } = await container.item(id).read<T>();
    return resource || null;
  }

  protected async fetchOne(querySpec: SqlQuerySpec, db: 'client-db' | 'customer-db'): Promise<T | null> {
    const resources = await this.queryItems(querySpec, db);
    return resources[0] || null;
  }

  protected async fetchAll(querySpec: SqlQuerySpec, db: 'client-db' | 'customer-db'): Promise<Array<T>> {
    return await this.queryItems(querySpec, db);
  }
}
