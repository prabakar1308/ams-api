import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class DataResponseInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data: unknown) => ({
        status: response.statusCode,
        message: response.statusMessage,
        data,
        apiVersion: this.configService.get<string>('appConfig.apiVersion'),
      })),
      catchError((err: unknown) => {
        console.log('Error:', err);
        const status = err instanceof HttpException ? err.getStatus() : 500;
        const errorResponse = {
          status,
          message: err instanceof Error ? err.message : 'Internal server error',
          apiVersion: this.configService.get<string>('appConfig.apiVersion'),
          data: null,
        };
        return throwError(() => new HttpException(errorResponse, status));
      }),
    );
  }
}
