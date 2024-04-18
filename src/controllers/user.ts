import type { IUserLogin, IUserRegister } from '@/types/request/user';
import type { Response } from 'express';
import type { WRRequest } from '@/libs/wr_request';
import { RespError, WRResponse } from '@/libs/wr_response';
import UserValidation from '@/validations/user/user';
import UserService from '@/services/user';

export default class UserController {
  private validation = new UserValidation();
  private service = new UserService();
  private resp = new WRResponse();

  public async login(request: WRRequest<IUserLogin, null, null>, response: Response) {
    const params = request.body;
    const valSchema = this.validation.getLoginVS();
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.login(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }

  public async register(request: WRRequest<IUserRegister, null, null>, response: Response) {
    const params = request.body;
    const valSchema = this.validation.getRegisterVS();
    const result = valSchema.validate(params);
    if (result.error == null) {
      const resp = await this.service.register(params);
      this.resp.resp(response).send(resp);
    } else {
      this.resp.resp(response).error(RespError.validation(result.error.message));
    }
  }
}
