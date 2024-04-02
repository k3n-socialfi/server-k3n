import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { camelizeKeys } from 'humps'; // Thư viện để chuyển đổi snake_case thành camelCase

@Injectable()
export class SnakeToCamelInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        return this.transformResponseData(data);
      })
    );
  }

  private transformResponseData(data: any): any {
    return camelizeKeys(data);
  }
}
