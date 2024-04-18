import type { IUserModel } from '@/db/models/user';
import { BaseRepository } from '@/db/repositories/base';
import constants from '@/common/constants';

export default class UserRepository extends BaseRepository<IUserModel> {
  constructor() {
    super(constants.COSMOS.CONTAINER.CLIENT_DB, constants.COSMOS.CONTAINER.CUSTOMER_DB);
  }

  public async createUser(params: IUserModel): Promise<IUserModel | null> {
    const user = await this.create(params, constants.COSMOS.CONTAINER.CLIENT_DB);
    return user;
  }

  public async findUserByEmail(email: string): Promise<IUserModel | null> {
    const { querySpec } = this._query_builder
      .select()
      .equals('email', email)
      .equals('client', constants.ENUMS.CLIENT.USER_CLIENT)
      .build();

    const user = await this.fetchOne(querySpec, constants.COSMOS.CONTAINER.CLIENT_DB);
    return user;
  }
}
