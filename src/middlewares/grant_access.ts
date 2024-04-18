import type { Response, NextFunction } from 'express';
import type { ServiceReturnVal } from '@/types/common';
import type { WRRequest } from '@/libs/wr_request';
import { RespError, WRResponse } from '@/libs/wr_response';
import constants from '@/common/constants';

type Features =
  | 'campaign'
  | 'journeys'
  | 'segment'
  | 'referral'
  | 'giftcard'
  | 'publisher'
  | 'inbox-builder'
  | 'customer-profile'
  | 'landing-page'
  | 'loyalty-rewards'
  | 'loyalty-program'
  | 'sms'
  | 'email'
  | 'whatsapp'
  | 'push-notification'
  | 'downloadCsvAccess'
  | 'qr-code-campaign'
  | 'points-reinstate'
  | 'integrations'
  | 'uploads'
  | 'dashboardsAccess'
  | 'in-app-promotions'
  | 'web-push'
  | 'facebook-ads'
  | 'google-ads'
  | 'help-center'
  | 'survey-builder'
  | 'in-app-notification'
  | 'web-onsite-notification'
  | 'member-pricing'
  | 'tikTok-ads'
  | 'snapchat-ads'
  | 'e-receipts';

/**
 * Middleware function for access control on a feature.
 * Approach
 * 1. Get the permission from user object on request
 * 2. Check whether that user has permission to view that feature.
 * 3. If the feature does not exist in the permissions object, return "Not Authorized".
 * 4. Else let the user through
 */
const grantAccess =
  (feature: Features) => async (request: WRRequest<any, any, any>, response: Response, next: NextFunction) => {
    const resp = new WRResponse();
    const returnVal: ServiceReturnVal<unknown> = {};

    const isAllowed = Object.keys(request.tokenUser.permissions).includes(feature);
    if (!isAllowed) {
      returnVal.error = new RespError(constants.RESP_ERR.CODE_401, constants.ERR_MESSAGES.NOT_ENOUGH_ACCESS);
      resp.resp(response).send(returnVal);
    } else {
      next();
    }
  };

export { grantAccess };
