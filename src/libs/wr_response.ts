import type { Response } from 'express';
import type { ServiceReturnVal } from '@/types/common';

import fs from 'fs';
import path from 'path';
import utility from '@/libs/utility';
import constants from '@/common/constants';

export class RespError extends Error {
  public code: number = 0;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
  }

  public static unauthenticated(
    message: string = 'Unauthenticated',
    code: number = constants.RESP_ERR.CODE_401,
  ): Error {
    return new RespError(code, message);
  }

  public static validation(message: string, code: number = constants.RESP_ERR.CODE_400): Error {
    return new RespError(code, message);
  }

  public static unauthorizedAction(
    message: string = constants.ERR_MESSAGES.NOT_AUTHORIZED,
    code: number = constants.RESP_ERR.CODE_422,
  ): Error {
    return new RespError(code, message);
  }
}

export class WRResponse {
  private response?: Response;

  public resp(response: Response) {
    this.response = response;
    return this;
  }

  public send(data: ServiceReturnVal<any>) {
    if (data.error) {
      this.response!.status((data.error as RespError).code).json({ error: data.error.message });
    } else {
      this.response!.json(data);
    }
  }

  public sendFile(data: ServiceReturnVal<any>) {
    if (data.error) {
      this.response!.status((data.error as RespError).code).json({ error: data.error.message });
    } else {
      try {
        var file = fs.createReadStream(data.filePath!);

        var headers = {
          'Content-disposition': `attachment; filename="${path.basename(data.filePath!)}"`,
        };

        if (!utility.isEmpty(data.mimeType)) {
          headers['Content-type'] = data.mimeType;
        }

        this.response!.writeHead(200, headers);
        file.pipe(this.response!);

        file.on('close', function () {
          fs.unlinkSync(data.filePath!);
        });

        file.on('error', (error) => {
          this.error(error);
          fs.unlinkSync(data.filePath!);
        });
      } catch (error) {
        this.error(error);
      }
    }
  }

  public error(error: Error) {
    this.response!.status((error as RespError).code).json({ error: error.message });
  }
}

export class RespVal<T> {
  private response: ServiceReturnVal<T> = {};

  constructor(response: ServiceReturnVal<T>) {
    this.response = response;
  }

  public send() {
    return this.response;
  }
}
