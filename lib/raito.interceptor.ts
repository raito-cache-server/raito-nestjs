import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { RaitoService } from './raito.service';
import e from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RaitoInterceptor implements NestInterceptor {
  constructor(
    @Inject('RAITO_SERVICE') private readonly raitoService: RaitoService,
  ) {}

  public async intercept(context: ExecutionContext, next: CallHandler<any>) {
    const request = context.switchToHttp().getRequest();
    const cacheKey = this.generateCacheKey(request);

    const cacheResponse = await this.raitoService.get(cacheKey);
    if (cacheResponse) {
      return new Observable((sub) => {
        sub.next(cacheResponse.data);
        sub.complete();
      });
    }

    return next.handle().pipe(
      tap(async (response) => {
        await this.raitoService.set(cacheKey, response);
      }),
    );
  }

  private generateCacheKey(request: e.Request) {
    return `${request.method}:${request.originalUrl || request.url}`;
  }
}
