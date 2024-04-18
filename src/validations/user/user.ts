import Joi, { ObjectSchema, PartialSchemaMap } from 'joi';
import Base from '@/validations/base';

export default class UserValidation extends Base {
  public getLoginVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.email = this.isEmail(true);
    schema.password = this.isPassword(true);

    return Joi.object(schema);
  }

  public getRegisterVS(): ObjectSchema {
    const schema: PartialSchemaMap = {};
    schema.firstName = this.isString(true);
    schema.lastName = this.isString(true);
    schema.email = this.isEmail(true);
    schema.password = this.isPassword(true);

    return Joi.object(schema);
  }
}
