import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

import { OkMap } from '@common/constants/respond-success';
import { ResponseDto } from './success-response.dto';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Handle request
    const time = new Date();
    const requestID =
      '' +
      time.getFullYear() +
      '-' +
      (time.getMonth() + 1) +
      '-' +
      time.getDate() +
      '-' +
      Math.floor(Math.random() * 100000000);
    this.logger.log(
      `info: RequestID: ${requestID} - Calling API: ${context.switchToHttp().getRequest().url}`,
      LoggingInterceptor.name
    );

    const request = context.switchToHttp().getRequest();
    request.headers['requestId'] = requestID;

    if (request.path === '/api/v1/oauth/twitter/callback') {
      return next.handle(); // Directly proceed without logging or wrapping
    }

    const body = request.body;
    if (body && Object.keys(body).length != 0) {
      this.logger.log(`Body:\n${JSON.stringify(body, null, 4)}`, LoggingInterceptor.name);
    }

    const params = request.params;
    if (params && Object.keys(params).length != 0) {
      this.logger.log(`Params:\n${JSON.stringify(params, null, 4)}`, LoggingInterceptor.name);
    }

    // Handle response
    return next.handle().pipe(
      map((rs) => {
        const finalResponse: ResponseDto<any> = {
          code: rs.code,
          message: rs.message,
          data: rs.data,
          time: time.toISOString()
        };

        this.logger.debug(`Response:\n${JSON.stringify(finalResponse, null, 4)}`, LoggingInterceptor.name);
        this.logger.log(`info: End RequestID: ${requestID}`, LoggingInterceptor.name);

        return finalResponse;
      })
    );
  }
}
