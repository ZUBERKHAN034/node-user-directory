import type { ServiceReturnVal } from '@/types/common';
import type { IUserLogin, IUserRegister } from '@/types/request/user';
import { RespError, RespVal } from '@/libs/wr_response';
import UserRepository from '@/db/repositories/user';
import constants from '@/common/constants';
import utility from '@/libs/utility';
import jwt from 'jsonwebtoken';

export default class UserService {
  private userRepo = new UserRepository();

  /**
   * @author Zuber Khan
   * @description service for login with email and password
   * @param  {IUserLogin} params user request details
   * @return {ServiceReturnVal} return the object
   */
  public async login(params: IUserLogin) {
    const returnVal: ServiceReturnVal = {};

    try {
      const user = await this.userRepo.findUserByEmail(params.email);
      if (!utility.isEmpty(user)) {
        const match = await utility.comparePassword(params.password, user.password);
        if (match) {
          const payload = {
            id: user.id,
            email: user.email,
            client: user.client,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          };

          delete user.password;
          const token = jwt.sign(payload, process.env.JWT_SECRET!);
          return new RespVal({ data: { user, token } }).send();
        } else {
          returnVal.error = new RespError(constants.RESP_ERR.CODE_401, constants.ERR_MESSAGES.INVALID_EMAIL_PASSWORD);
        }
      } else {
        returnVal.error = new RespError(constants.RESP_ERR.CODE_404, constants.ERR_MESSAGES.USER_NOT_EXIST);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR.CODE_500, error.message);
    }
    return returnVal;
  }

  /**
   * @author Zuber Khan
   * @description service for register with email and password
   * @param  {IUserRegister} params user request details
   * @return {ServiceReturnVal} return the object
   */
  public async register(params: IUserRegister) {
    const returnVal: ServiceReturnVal = {};

    try {
      const isUser = await this.userRepo.findUserByEmail(params.email);
      if (utility.isEmpty(isUser)) {
        const hashedPassword = await utility.hashPassword(params.password);
        const newUser = {
          email: params.email.toLowerCase(),
          password: hashedPassword,
          firstName: params.firstName,
          lastName: params.lastName,
          client: constants.ENUMS.CLIENT.USER_CLIENT,
          type: constants.ENUMS.TYPE.CUSTOM,
          role: constants.ENUMS.ROLE.USER,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const user = await this.userRepo.createUser(newUser);
        return new RespVal({ data: user }).send();
      } else {
        returnVal.error = new RespError(constants.RESP_ERR.CODE_409, constants.ERR_MESSAGES.USER_ALREADY_EXISTS);
      }
    } catch (error) {
      returnVal.error = new RespError(constants.RESP_ERR.CODE_500, error.message);
    }
    return returnVal;
  }
}
