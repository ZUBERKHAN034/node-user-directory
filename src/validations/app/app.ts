import Joi, { AnySchema, ObjectSchema, PartialSchemaMap } from 'joi';
import constants from '@/common/constants';
import Base from '@/validations/base';

export default class AppValidation extends Base {
  private isCosmosContainer(isRequired: boolean): AnySchema {
    let schema = Joi.string().valid(constants.COSMOS.CONTAINER.CLIENT_DB, constants.COSMOS.CONTAINER.CUSTOMER_DB);

    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  private isCosmosDatabase(isRequired: boolean): AnySchema {
    let schema = Joi.string().valid(constants.COSMOS.DATABASE.DB);

    if (isRequired) {
      schema = schema.required();
    }
    return schema;
  }

  public getDBManagerVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.endpoint = this.isURL(true);
    schema.key = this.isString(true);
    schema.database = this.isCosmosDatabase(true);
    schema.container = this.isCosmosContainer(true);
    schema.debug = this.isBoolean(false);

    return Joi.object(schema);
  }
}
