import type { Response, NextFunction } from 'express';
import type { ServiceReturnVal } from '@/types/common';
import type { WRRequest } from '@/libs/wr_request';
import { RespError, WRResponse } from '@/libs/wr_response';
import constants from '@/common/constants';

type UserRole = 'superAdmin' | 'admin' | 'user' | 'custom';

/**
 * Middleware function for check user role to access a API.
 * Approach
 * 1. Get the userRole from user object on request
 * 2. Check whether that user role allow to access that API.
 * 3. If the user role not matched, return "Not Authorized".
 * 4. Else let the user through
 */
const checkRole =
  (role: UserRole) => async (request: WRRequest<any, any, any>, response: Response, next: NextFunction) => {
    const resp = new WRResponse();
    const returnVal: ServiceReturnVal<unknown> = {};

    if (request.tokenUser.userRole !== role) {
      returnVal.error = new RespError(constants.RESP_ERR.CODE_403, constants.ERR_MESSAGES.NOT_AUTHORIZED);
      resp.resp(response).send(returnVal);
    } else {
      next();
    }
  };

export { checkRole };
