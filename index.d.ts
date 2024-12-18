import {
  CallHandler,
  DynamicModule,
  ExecutionContext,
  ModuleMetadata,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

export interface ICache {
  key: string;
  data: string;
  createdAt: Date;
  ttl?: number;
}

type ConnectionOptions = {
  host?: string;
  port?: number;
  ttl?: number;
};
type ConnectionString =
  | `raito://${string}:${number}?ttl=${number}`
  | `raito://${string}:${number}`;
type RaitoOptions = ConnectionOptions | ConnectionString | number;

export interface RaitoModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory: (...args: any[]) => Promise<RaitoOptions> | RaitoOptions;
  inject?: any[];
}

export declare class RaitoService {
  public get(key: string): Promise<ICache | null>;
  public set(key: string, data: any, ttl?: number): Promise<void>;
  public clear(key: string): Promise<void>;
  public shutdown(): void;
}

export declare class RaitoModule {
  public static register(options?: RaitoOptions): DynamicModule;
  public static registerAsync(options: RaitoModuleAsyncOptions): DynamicModule;
}

export declare class RaitoInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>>;
}

export {};
