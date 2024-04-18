import type { CosmosDBConfig } from '@/types/common';
import type { Database, Container, CosmosClientOptions } from '@azure/cosmos';
import { CosmosClient } from '@azure/cosmos';
import { setLogLevel } from '@azure/logger';
import AppValidation from '@/validations/app/app';
import constants from '@/common/constants';
import utility from '@/libs/utility';

export class CosmosDB {
  private static validation = new AppValidation();
  private static client: CosmosClient;
  private static database: string;
  private static container: string;

  /**
   * Connects to the CosmosDB database using the provided configuration.
   *
   * @param {CosmosDBConfig} config - The configuration object for the CosmosDB connection.
   * @return {Promise<void>} A promise that resolves when the connection is established successfully.
   */
  public static async connect(config: CosmosDBConfig): Promise<void> {
    const valSchema = this.validation.getDBManagerVS();
    const result = valSchema.validate(config);

    if (result.error == null) {
      if (!utility.isEmpty(config.debug)) {
        setLogLevel('info');
      }

      if (!this.client) {
        const clientConfig: CosmosClientOptions = {
          endpoint: config.endpoint,
          key: config.key,
        };

        this.client = new CosmosClient(clientConfig);
        this.database = config.database;
        this.container = config.container;

        try {
          const database = this.client.database(this.database);
          await database.read();
          // eslint-disable-next-line no-console
          console.debug('DATABASE CONNECTED SUCCESSFULLY ✅');
        } catch (error) {
          // eslint-disable-next-line no-console
          // console.error('Error during database connection:', error); // UNCOMMENT TO SEE DETAILED ERROR --> [ ctrl + / ]
          throw new Error(error);
        }
      }
    } else {
      throw new Error(result.error.message);
    }
  }

  /**
   * Returns the CosmosClient instance.
   *
   * @return {CosmosClient} The CosmosClient instance.
   * @throws {Error} Error thrown if CosmosClient is not initialized. Call connect() first.
   */
  protected static getClient(): CosmosClient {
    if (this.client) return this.client;
    else throw new Error('Azure Cosmos DB client not initialized. Call connect() first.');
  }

  /**
   * Retrieves the database instance.
   *
   * @return {Database} The database instance.
   */
  protected static getDatabase(): Database {
    const client = this.getClient();
    return client.database(this.database);
  }

  /**
   * Retrieves the specified container from the database.
   *
   * @param {string} containerName - The name of the container to retrieve. Valid values are 'client-db' and 'customer-db'.
   * @return {Container} The retrieved container.
   */
  protected static getContainer(containerName: 'client-db' | 'customer-db'): Container {
    const selected = containerName == this.container ? this.container : constants.COSMOS.CONTAINER.CLIENT_DB;
    const database = this.getDatabase();
    return database.container(selected);
  }
}
